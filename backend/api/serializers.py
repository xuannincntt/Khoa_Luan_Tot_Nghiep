from rest_framework import serializers
from .models import (
    User, Role, Patient, Employee, EmployeeType, Department, Appointment,
    MedicalRecord, MedicalVisit, BasicHealthcare, HealthConditionType,
    Prescription, PrescriptionDetail, Drug, Service, Invoice, InvoiceDetail,
    ActivityLog, Hospital, ResultType, Result
)

# =======================================================
# 1. SERIALIZERS CHO CẤU TRÚC HỆ THỐNG
# =======================================================

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name') # ID tự sinh của Django được gọi là 'id'

class EmployeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeType
        fields = ('id', 'name')

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


# =======================================================
# 2. SERIALIZERS CHO USER VÀ ACTOR (DỄ TRUY XUẤT)
# =======================================================

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer cho bảng User - Chứa thông tin đăng nhập và liên hệ
    """
    role_name = serializers.CharField(source='role.name', read_only=True)
    class Meta:
        model = User
        fields = (
            'id', 'citizen_id', 'email', 'phone', 'role', 'role_name', 
            'is_active', 'created_at', 'password_hash'
        )
        extra_kwargs = {
            # Bắt buộc phải có, không được hiển thị mật khẩu
            'password_hash': {'write_only': True} 
        }

class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer cho Bệnh nhân - Lấy thông tin liên hệ từ bảng User liên kết
    """
    # Lấy thông tin từ bảng User (mối quan hệ OneToOne)
    citizen_id = serializers.CharField(source='user.citizen_id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    class Meta:
        model = Patient
        fields = (
            # Khóa chính/Khóa ngoại đến User
            'user', 
            # Thông tin Actor từ User
            'citizen_id', 'email', 'phone', 
            # Thông tin Actor từ Patient
            'full_name', 'date_of_birth', 'gender', 'address'
        )
        # Chỉ định trường 'user' là read_only nếu bạn không muốn ReactJS tạo user mới khi tạo patient

class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer cho Nhân viên (Bác sĩ, Hành chính, v.v.)
    """
    # Lấy thông tin liên hệ từ bảng User liên kết
    citizen_id = serializers.CharField(source='user.citizen_id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    # Hiển thị tên đầy đủ của khóa ngoại
    employee_type_name = serializers.CharField(source='employee_type.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    class Meta:
        model = Employee
        fields = (
            # Khóa chính/Khóa ngoại đến User
            'user',
            # Thông tin Actor từ User
            'citizen_id', 'email', 'phone', 
            # Khóa ngoại và tên hiển thị
            'employee_type', 'employee_type_name',
            'department', 'department_name',
            # Trường dữ liệu của Employee
            'full_name', 'date_of_birth', 'gender', 'address'
        )

# =======================================================
# 1. SERIALIZERS CHO CẤU TRÚC HỒ SƠ
# =======================================================

class HealthConditionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthConditionType
        fields = ('id', 'name')

class BasicHealthcareSerializer(serializers.ModelSerializer):
    """
    Serializer cho từng mục Bệnh sử (Dị ứng, Phẫu thuật,...)
    """
    condition_type_name = serializers.CharField(source='condition_type.name', read_only=True)
    detected_hospital_name = serializers.CharField(source='detected_hospital.name', read_only=True)

    class Meta:
        model = BasicHealthcare
        fields = (
            'id', 'medical_record', 
            'condition_type', 'condition_type_name', 
            'disease_name', 'detected_hospital', 'detected_hospital_name', 
            'detected_year', 'current_status', 'notes', 'recorded_at'
        )

class MedicalRecordSerializer(serializers.ModelSerializer):
    """
    Serializer cho Hồ sơ tổng hợp (Hiển thị Bệnh sử chi tiết)
    """
    patient_full_name = serializers.CharField(source='patient.full_name', read_only=True)
    # Sử dụng BasicHealthcareSerializer để hiển thị các bệnh sử liên quan (Nested Serializer)
    health_conditions = BasicHealthcareSerializer(many=True, read_only=True) 

    class Meta:
        model = MedicalRecord
        # Vì primary_key=True trên trường patient, ta dùng 'patient' làm PK
        fields = ('patient', 'patient_full_name', 'date_created', 'health_conditions')


# =======================================================
# 2. SERIALIZERS CHO QUY TRÌNH KHÁM VÀ ĐƠN THUỐC
# =======================================================

class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer cho Lịch hẹn khám
    """
    patient_full_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_full_name = serializers.CharField(source='doctor.full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = (
            'id', 'patient', 'patient_full_name', 
            'doctor', 'doctor_full_name', 
            'appointment_datetime', 'status', 'created_at'
        )
        read_only_fields = ('created_at',)
        # Đảm bảo Doctor là Employee (limit_choices_to đã được áp dụng trong Model)

class MedicalVisitSerializer(serializers.ModelSerializer):
    """
    Serializer cho Chi tiết Lần khám (Liên kết với Appointment)
    """
    # Lấy thông tin từ Appointment
    patient_full_name = serializers.CharField(source='appointment.patient.full_name', read_only=True)
    doctor_full_name = serializers.CharField(source='appointment.doctor.full_name', read_only=True)
    appointment_datetime = serializers.DateTimeField(source='appointment.appointment_datetime', read_only=True)
    
    class Meta:
        model = MedicalVisit
        fields = (
            # Khóa chính/Khóa ngoại
            'appointment', 'record', 
            # Thông tin hiển thị từ mối quan hệ
            'patient_full_name', 'doctor_full_name', 'appointment_datetime',
            # Chi tiết lần khám
            'diagnosis', 'treatment_protocol', 'recorded_at'
        )
        read_only_fields = ('recorded_at',)


# =======================================================
# 3. SERIALIZERS CHO THUỐC VÀ KÊ ĐƠN
# =======================================================

class DrugSerializer(serializers.ModelSerializer):
    """
    Serializer cho Danh mục Thuốc
    """
    class Meta:
        model = Drug
        fields = ('id', 'name', 'unit', 'price', 'recorded_at')

class PrescriptionDetailSerializer(serializers.ModelSerializer):
    """
    Serializer cho Chi tiết các loại thuốc trong Đơn thuốc
    """
    drug_name = serializers.CharField(source='drug.name', read_only=True)
    drug_unit = serializers.CharField(source='drug.unit', read_only=True) # Lấy đơn vị tính từ bảng Drug

    class Meta:
        model = PrescriptionDetail
        fields = (
            'id', 'prescription', 'drug', 'drug_name', 'drug_unit', 
            'quantity', 'dosage', 'duration_days', 'recorded_at'
        )

class PrescriptionSerializer(serializers.ModelSerializer):
    """
    Serializer cho Đơn thuốc (Hiển thị chi tiết thuốc)
    """
    # Sử dụng PrescriptionDetailSerializer để hiển thị các chi tiết thuốc (Nested Serializer)
    details = PrescriptionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Prescription
        fields = ('visit', 'prescription_date', 'details')


# =======================================================
# 4. SERIALIZERS CHO KẾT QUẢ XÉT NGHIỆM
# =======================================================

class ResultTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultType
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    """
    Serializer cho Kết quả Xét nghiệm/Chẩn đoán
    """
    result_type_name = serializers.CharField(source='result_type.name', read_only=True)
    technician_full_name = serializers.CharField(source='technician.full_name', read_only=True)

    class Meta:
        model = Result
        fields = (
            'id', 'visit', 'result_type', 'result_type_name', 
            'technician', 'technician_full_name', 
            'result_file_url', 'start_time', 'end_time', 'recorded_at'
        )
        read_only_fields = ('end_time', 'recorded_at')

# =======================================================
# 1. SERIALIZER CHO DANH MỤC DỊCH VỤ
# =======================================================

class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer cho Danh mục Dịch vụ (Thủ thuật, Xét nghiệm)
    """
    class Meta:
        model = Service
        # Sử dụng '__all__' vì không có khóa ngoại phức tạp
        fields = '__all__'

# =======================================================
# 2. SERIALIZER CHO CHI TIẾT HÓA ĐƠN
# =======================================================

class InvoiceDetailSerializer(serializers.ModelSerializer):
    """
    Serializer cho Chi tiết từng mục trong Hóa đơn
    (Hiển thị các mục tính tiền: thuốc, dịch vụ)
    """
    # Lấy tên của mục đó (Drug/Service) để hiển thị trong ReactJS
    # (Tùy chọn: cần thêm logic trong serializer để phân biệt item_type và truy vấn tên)
    # Ví dụ: item_name = serializers.SerializerMethodField()
    
    class Meta:
        model = InvoiceDetail
        # Bao gồm tất cả các trường chi tiết để tính toán
        fields = ('id', 'invoice', 'item_type', 'item_id', 'description', 
                  'quantity', 'unit_price', 'sub_total')

# =======================================================
# 3. SERIALIZER CHO HÓA ĐƠN TỔNG HỢP
# =======================================================

class InvoiceSerializer(serializers.ModelSerializer):
    """
    Serializer cho Hóa đơn tổng hợp (Liệt kê chi tiết tính tiền)
    """
    # Hiển thị tên bệnh nhân
    patient_full_name = serializers.CharField(source='patient.full_name', read_only=True)
    
    # Hiển thị chi tiết các mục tính tiền (Nested Serializer)
    details = InvoiceDetailSerializer(many=True, read_only=True) 

    class Meta:
        model = Invoice
        # Vì primary_key=True trên trường visit, ta dùng 'visit' làm PK/FK
        fields = (
            'visit', 'patient', 'patient_full_name', 
            'total_amount', 'status', 'details'
        )
        read_only_fields = ('total_amount',) # Tổng tiền thường được tính toán ở backend

# =======================================================
# 4. SERIALIZER CHO NHẬT KÝ HỆ THỐNG
# =======================================================

class ActivityLogSerializer(serializers.ModelSerializer):
    """
    Serializer cho Nhật ký hoạt động
    """
    # Lấy citizen_id của người dùng thực hiện hành động
    user_citizen_id = serializers.CharField(source='user.citizen_id', read_only=True)
    user_role_name = serializers.CharField(source='user.role.name', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ('id', 'user', 'user_citizen_id', 'user_role_name', 'action', 'timestamp')
        read_only_fields = ('timestamp',)

