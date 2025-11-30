from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from .models import *
from .serializers import *
from datetime import datetime, timedelta, time
from django.utils import timezone
from rest_framework.decorators import api_view

# --- 1. API ĐĂNG NHẬP (Custom) ---
class LoginView(APIView):
    def post(self, request):
        citizen_id = request.data.get('citizen_id')
        password = request.data.get('password')

        # Tìm user
        try:
            user = User.objects.get(citizen_id=citizen_id)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Tài khoản không tồn tại'}, status=400)

        # Check pass
        if not check_password(password, user.password_hash):
            return Response({'success': False, 'message': 'Sai mật khẩu'}, status=400)
        
        # Lấy tên hiển thị
        full_name = ""
        if hasattr(user, 'patient_profile'): full_name = user.patient_profile.full_name
        elif hasattr(user, 'employee_profile'): full_name = user.employee_profile.full_name

        # Trả về kết quả (Ở đây mình trả về token giả lập để đơn giản hóa)
        return Response({
            'success': True,
            'token': f"fake-jwt-token-{user.id}", # Sau này sẽ thay bằng JWT thật
            'user': {
                'id': user.id,
                'citizen_id': user.citizen_id,
                'role': user.role.name,
                'full_name': full_name
            }
        })

# --- 2. API VIEWSETS (Tự động tạo CRUD) ---

class RoleViewSet(viewsets.ReadOnlyModelViewSet): # Chỉ xem
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    # Nếu là POST (đăng ký) thì dùng serializer đăng ký, còn lại dùng serializer thường
    def get_serializer_class(self):
        if self.action == 'create':
            return PatientRegistrationSerializer
        return PatientSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    # API phụ: Lấy lịch sử khám của 1 bệnh nhân cụ thể
    # Gọi: /api/appointments/?patient_id=2
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Lọc theo bác sĩ (dành cho trang Doctor Dashboard)
        doctor_id = self.request.query_params.get('doctor_id')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
            
        # Lọc theo ngày (nếu cần xem lịch hôm nay)
        date_str = self.request.query_params.get('date')
        if date_str:
            queryset = queryset.filter(appointment_datetime__date=date_str)
            
        return queryset.order_by('appointment_datetime')

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class DrugViewSet(viewsets.ModelViewSet):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer


def generate_time_slots(start_hour=8, end_hour=17, interval_minutes=30):
    slots = []
    current_time = time(start_hour, 0)
    end_time = time(end_hour, 0)
    
    while current_time < end_time:
        slots.append(current_time.strftime("%H:%M"))
        # Cộng thêm 30 phút
        dt = datetime.combine(datetime.today(), current_time) + timedelta(minutes=interval_minutes)
        current_time = dt.time()
    return slots

@api_view(['GET'])
def get_available_slots(request):
    """
    API lấy lịch trống.
    Params: 
      - doctor_id: ID bác sĩ
      - date: Ngày muốn xem (YYYY-MM-DD)
    """
    doctor_id = request.query_params.get('doctor_id')
    date_str = request.query_params.get('date')

    if not doctor_id or not date_str:
        return Response({'error': 'Thiếu doctor_id hoặc date'}, status=400)

    try:
        # 1. Lấy tất cả lịch hẹn ĐÃ ĐẶT của bác sĩ đó trong ngày đó
        booked_appointments = Appointment.objects.filter(
            doctor_id=doctor_id,
            appointment_datetime__date=date_str
        ).exclude(status='CA') # Bỏ qua các lịch đã hủy

        # Tạo danh sách giờ đã bị chiếm (VD: ['08:00', '09:30'])
        booked_times = [
            app.appointment_datetime.strftime("%H:%M") 
            for app in booked_appointments
        ]

        # 2. Sinh ra tất cả các slot trong ngày
        all_slots = generate_time_slots()

        # 3. Loại bỏ giờ đã đặt
        available_slots = [
            slot for slot in all_slots 
            if slot not in booked_times
        ]

        return Response({
            'doctor_id': doctor_id,
            'date': date_str,
            'available_slots': available_slots
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)