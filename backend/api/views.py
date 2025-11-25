from rest_framework import viewsets
from rest_framework import permissions # Cần thiết cho việc phân quyền (bạn sẽ cần triển khai trong thực tế)
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F # Dùng để tối ưu truy vấn

from .models import (
    User, Role, Patient, Employee, Department, Appointment,
    MedicalVisit, MedicalRecord, BasicHealthcare, Prescription,
    Drug, Service, Invoice, InvoiceDetail, ActivityLog, EmployeeType,
    HealthConditionType, Hospital, ResultType, Result
)
from .serializers import (
    UserSerializer, RoleSerializer, PatientSerializer, EmployeeSerializer,
    DepartmentSerializer, AppointmentSerializer, MedicalVisitSerializer,
    MedicalRecordSerializer, BasicHealthcareSerializer, PrescriptionSerializer,
    DrugSerializer, ServiceSerializer, InvoiceSerializer, ActivityLogSerializer,
    EmployeeTypeSerializer, HealthConditionTypeSerializer, HospitalSerializer,
    ResultTypeSerializer, ResultSerializer, InvoiceDetailSerializer
)

# =======================================================
# 1. VIEWSETS CHO CẤU TRÚC, DANH MỤC & PHÂN QUYỀN
# =======================================================

class UserViewSet(viewsets.ModelViewSet):
    """Quản lý tài khoản đăng nhập chung"""
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer

class RoleViewSet(viewsets.ModelViewSet):
    """Quản lý Vai trò (Role)"""
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    
class DepartmentViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Khoa/Phòng"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
class HospitalViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Bệnh viện (Dùng cho Bệnh sử)"""
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class EmployeeTypeViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Loại nhân viên (Bác sĩ, Y tá,...)"""
    queryset = EmployeeType.objects.all()
    serializer_class = EmployeeTypeSerializer

class HealthConditionTypeViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Loại tiền sử bệnh"""
    queryset = HealthConditionType.objects.all()
    serializer_class = HealthConditionTypeSerializer


# =======================================================
# 2. VIEWSETS CHO ACTOR VÀ HỒ SƠ
# =======================================================

class PatientViewSet(viewsets.ModelViewSet):
    """Quản lý thông tin chi tiết Bệnh nhân"""
    queryset = Patient.objects.all().order_by('full_name')
    serializer_class = PatientSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """Quản lý thông tin chi tiết Nhân viên (Bao gồm Bác sĩ)"""
    queryset = Employee.objects.all().order_by('full_name')
    serializer_class = EmployeeSerializer

class MedicalRecordViewSet(viewsets.ModelViewSet):
    """Quản lý Hồ sơ Bệnh án Tổng hợp (MedicalRecord)"""
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

class BasicHealthcareViewSet(viewsets.ModelViewSet):
    """Quản lý Bệnh sử trọn đời (Dị ứng, Phẫu thuật,...)"""
    queryset = BasicHealthcare.objects.all().order_by('-recorded_at')
    serializer_class = BasicHealthcareSerializer
    
# =======================================================
# 3. VIEWSETS CHO QUY TRÌNH KHÁM
# =======================================================

class AppointmentViewSet(viewsets.ModelViewSet):
    """Quản lý Lịch hẹn khám"""
    queryset = Appointment.objects.all().order_by('-appointment_datetime')
    serializer_class = AppointmentSerializer

class MedicalVisitViewSet(viewsets.ModelViewSet):
    """Quản lý Chi tiết Lần khám (Chẩn đoán, Phác đồ điều trị)"""
    queryset = MedicalVisit.objects.all().order_by('-recorded_at')
    serializer_class = MedicalVisitSerializer
    
    # Custom action: Lấy danh sách lần khám theo bệnh nhân (để React dễ truy vấn)
    @action(detail=False, methods=['get'])
    def by_patient(self, request):
        patient_id = request.query_params.get('patient_id')
        if not patient_id:
            return Response({"error": "Vui lòng cung cấp patient_id"}, status=400)
        
        visits = self.queryset.filter(patient_id=patient_id).order_by('-recorded_at')
        serializer = self.get_serializer(visits, many=True)
        return Response(serializer.data)


# =======================================================
# 4. VIEWSETS CHO THUỐC, DỊCH VỤ VÀ KẾT QUẢ
# =======================================================

class DrugViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Thuốc"""
    queryset = Drug.objects.all().order_by('name')
    serializer_class = DrugSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Dịch vụ"""
    queryset = Service.objects.all().order_by('name')
    serializer_class = ServiceSerializer
    
class PrescriptionViewSet(viewsets.ModelViewSet):
    """Quản lý Đơn thuốc"""
    queryset = Prescription.objects.all().order_by('-visit__recorded_at')
    serializer_class = PrescriptionSerializer

class ResultViewSet(viewsets.ModelViewSet):
    """Quản lý Kết quả Xét nghiệm/Chẩn đoán hình ảnh"""
    queryset = Result.objects.all().order_by('-end_time')
    serializer_class = ResultSerializer

class ResultTypeViewSet(viewsets.ModelViewSet):
    """Quản lý Danh mục Loại kết quả"""
    queryset = ResultType.objects.all()
    serializer_class = ResultTypeSerializer
    
# =======================================================
# 5. VIEWSETS CHO TÀI CHÍNH VÀ HỆ THỐNG
# =======================================================

class InvoiceViewSet(viewsets.ModelViewSet):
    """Quản lý Hóa đơn"""
    # Tối ưu: `select_related` để load sẵn thông tin Patient và Visit, giảm truy vấn DB
    queryset = Invoice.objects.select_related('patient', 'visit').order_by('-visit__recorded_at')
    serializer_class = InvoiceSerializer
    
    # Custom action: Lấy chi tiết hóa đơn (InvoiceDetail) theo Invoice ID
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        invoice = self.get_object()
        details = InvoiceDetail.objects.filter(invoice=invoice)
        serializer = InvoiceDetailSerializer(details, many=True)
        return Response(serializer.data)

class InvoiceDetailViewSet(viewsets.ModelViewSet):
    """Quản lý Chi tiết từng mục trong Hóa đơn (Chủ yếu dùng cho CRUD chi tiết)"""
    queryset = InvoiceDetail.objects.all()
    serializer_class = InvoiceDetailSerializer

class ActivityLogViewSet(viewsets.ModelViewSet):
    """Quản lý Nhật ký hoạt động"""
    queryset = ActivityLog.objects.select_related('user', 'user__role').order_by('-timestamp')
    serializer_class = ActivityLogSerializer