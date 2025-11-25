from django.db import models
from django.utils import timezone

# =======================================================
# 1. QUẢN LÝ TÀI KHOẢN VÀ PHÂN QUYỀN
# =======================================================

class Role(models.Model):
    """Phân quyền hệ thống cơ bản"""
    name = models.CharField(max_length=50, unique=True) # e.g., 'ADMIN', 'PATIENT', 'EMPLOYEE'
    class Meta:
        verbose_name_plural = "Vai trò"
    def __str__(self): return self.name
class User(models.Model):
    # Thay thế username bằng Citizen ID (Căn cước công dân)
    citizen_id = models.CharField(max_length=20, unique=True, verbose_name="Căn cước/Mã định danh") 
    password_hash = models.CharField(max_length=255)
    email = models.EmailField(max_length=100, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    # Thêm trường thời gian ghi nhận (Record Time)
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian tạo")    
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='users')
    class Meta:
        verbose_name_plural = "Người dùng"
    def __str__(self): return self.citizen_id
class EmployeeType(models.Model):
    """Phân loại chi tiết cho nhân viên bệnh viện"""
    name = models.CharField(max_length=100, unique=True) # e.g., 'DOCTOR', 'NURSE', 'SECURITY', 'ADMIN_STAFF'
    class Meta:
        verbose_name_plural = "Loại Nhân viên"
    def __str__(self): return self.name
class Hospital(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    class Meta:
        verbose_name_plural = "Bệnh viện"
    def __str__(self): return self.name
class Department(models.Model):
    """Danh mục Khoa/Phòng"""
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        verbose_name_plural = "Khoa/Phòng"
    def __str__(self): return self.name
# --- Actor Profiles ---
class Patient(models.Model):
    """Thông tin chi tiết Bệnh nhân"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='patient_profile')
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    address = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        verbose_name_plural = "Bệnh nhân"
    def __str__(self): return self.full_name
class Employee(models.Model):
    """Thông tin chi tiết Nhân viên (Bao gồm Bác sĩ, Y tá, Hành chính, Bảo vệ...)"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='employee_profile')
    employee_type = models.ForeignKey(EmployeeType, on_delete=models.PROTECT)
    full_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='employees')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    address = models.CharField(max_length=255, null=True, blank=True)
    # Thêm các trường khác như certification, specialty (nếu là bác sĩ/y tá)
    class Meta:
        verbose_name_plural = "Nhân viên Bệnh viện"
    def __str__(self): return f"{self.employee_type.name}: {self.full_name}"


# =======================================================
# 2. QUY TRÌNH KHÁM CHỮA BỆNH
# =======================================================

class Appointment(models.Model):
    """Lịch hẹn khám"""
    STATUS_CHOICES = [('P', 'Pending'), ('C', 'Confirmed'), ('CM', 'Completed'), ('CA', 'Cancelled')]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    # Giả định chỉ bác sĩ có thể khám
    doctor = models.ForeignKey(Employee, on_delete=models.PROTECT, limit_choices_to={'employee_type__name': 'DOCTOR'}, related_name='doctor_appointments')
    appointment_datetime = models.DateTimeField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='P')
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian tạo")
    class Meta:
        unique_together = ('doctor', 'appointment_datetime')
        verbose_name_plural = "Lịch hẹn"
class MedicalRecord(models.Model):
    """Hồ sơ tổng hợp (liên kết 1:1 với Bệnh nhân)"""
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, primary_key=True, related_name='medical_record')
    date_created = models.DateTimeField(default=timezone.now)
    class Meta:
        verbose_name_plural = "Hồ sơ Bệnh án Tổng hợp"

# --- Danh mục Thể loại Bệnh/Vấn đề ---
class HealthConditionType(models.Model):
    name = models.CharField(max_length=50, unique=True) # e.g., 'Dị ứng', 'Di truyền', 'Phẫu thuật', 'Mãn tính', 'Thuốc'
    class Meta:
        verbose_name = "Thể loại Bệnh/Vấn đề"
    def __str__(self): return self.name

class BasicHealthcare(models.Model):
    """
    Thông tin sức khỏe cá nhân chi tiết (Bệnh sử trọn đời)
    Mỗi record là một vấn đề sức khỏe của bệnh nhân
    """
    # Liên kết N:1 với Hồ sơ tổng (Nhiều bệnh sử cho 1 Hồ sơ)
    medical_record = models.ForeignKey('MedicalRecord', on_delete=models.CASCADE, related_name='health_conditions')
    condition_type = models.ForeignKey(HealthConditionType, on_delete=models.PROTECT, verbose_name="Thể loại")
    disease_name = models.CharField(max_length=255, verbose_name="Tên Bệnh/Vấn đề")
    # Thêm các trường ghi nhận quá trình
    detected_hospital = models.ForeignKey(Hospital, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Phát hiện tại BV")
    detected_year = models.IntegerField(null=True, blank=True, verbose_name="Năm phát hiện")
    current_status = models.CharField(max_length=100, default='Đang theo dõi', verbose_name="Tình trạng")
    notes = models.TextField(null=True, blank=True, verbose_name="Ghi chú")
    # Trường thời gian ghi nhận
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
    class Meta:
        verbose_name_plural = "Thông tin Sức khỏe Cơ bản (Bệnh sử)"
        unique_together = ('medical_record', 'disease_name', 'condition_type') # Tránh trùng lặp hoàn toàn
class MedicalVisit(models.Model):
    """Chi tiết lần khám (liên kết 1:1 với Appointment)"""
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, primary_key=True, related_name='visit_detail')
    record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='visits') # Liên kết đến hồ sơ tổng
    diagnosis = models.TextField(null=True, blank=True)
    treatment_protocol = models.TextField(null=True, blank=True, verbose_name="Phác đồ Điều trị") # Thêm Phác đồ điều trị
    # Trường thời gian ghi nhận (Khi bác sĩ hoàn thành khám)
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
    class Meta:
        verbose_name_plural = "Chi tiết Lần khám"
# --- Bảng Drug (Thuốc) ---
class Drug(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Tên Thuốc")
    unit = models.CharField(max_length=50, verbose_name="Đơn vị tính") # e.g., Viên, Hộp, Chai
    price = models.FloatField(verbose_name="Giá bán lẻ")
    # ... các trường khác ...
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
# --- Bảng PrescriptionDetail (Chi tiết đơn thuốc) ---
class PrescriptionDetail(models.Model):
    prescription = models.ForeignKey('Prescription', on_delete=models.CASCADE, related_name='details')
    # Tên thuốc đã có qua Khóa ngoại Drug
    drug = models.ForeignKey('Drug', on_delete=models.PROTECT, verbose_name="Tên Thuốc") 
    quantity = models.IntegerField()
    dosage = models.CharField(max_length=255, verbose_name="Liều dùng") 
    # Bổ sung khoảng thời gian sử dụng thuốc
    duration_days = models.IntegerField(null=True, blank=True, verbose_name="Thời gian sử dụng (ngày)") 
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
    class Meta:
        verbose_name_plural = "Chi tiết Đơn thuốc"
class Prescription(models.Model):
    """Đơn thuốc"""
    visit = models.OneToOneField(MedicalVisit, on_delete=models.CASCADE, primary_key=True, related_name='prescription')
    prescription_date = models.DateTimeField(default=timezone.now)
    class Meta:
        verbose_name_plural = "Đơn thuốc"
class ResultType(models.Model):
    """Danh mục loại kết quả (Xét nghiệm, Siêu âm, X-quang)"""
    name = models.CharField(max_length=100, unique=True) 
    class Meta:
        verbose_name_plural = "Loại Kết quả"
    def __str__(self): return self.name
class Result(models.Model):
    """Kết quả xét nghiệm/chẩn đoán hình ảnh"""
    visit = models.ForeignKey(MedicalVisit, on_delete=models.CASCADE, related_name='results')
    result_type = models.ForeignKey(ResultType, on_delete=models.PROTECT)
    technician = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='performed_results') # Nhân viên thực hiện
    result_file_url = models.CharField(max_length=255) # Đường dẫn file kết quả
    start_time = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian bắt đầu")
    end_time = models.DateTimeField(default=timezone.now, verbose_name="Thời gian kết thúc/Có kết quả")
    class Meta:
        verbose_name_plural = "Kết quả Xét nghiệm/Chẩn đoán"


# =======================================================
# 3. THANH TOÁN VÀ HỆ THỐNG
# =======================================================

class Service(models.Model):
    """Danh mục Dịch vụ (Thủ thuật, Xét nghiệm...)"""
    name = models.CharField(max_length=100, unique=True)
    price = models.FloatField()
    class Meta:
        verbose_name_plural = "Dịch vụ"
    def __str__(self): return self.name
class Invoice(models.Model):
    """Hóa đơn tổng hợp (liên kết 1:1 với MedicalVisit)"""
    STATUS_CHOICES = [('P', 'Pending'), ('PA', 'Paid'), ('CA', 'Cancelled')]
    visit = models.OneToOneField(MedicalVisit, on_delete=models.CASCADE, primary_key=True, related_name='invoice')
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='invoices')
    total_amount = models.FloatField(default=0.0)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='P')
    class Meta:
        verbose_name_plural = "Hóa đơn"
# Giả định đã import Invoice, Service, Drug và PrescriptionDetail
class InvoiceDetail(models.Model):
    """
    Chi tiết từng mục trong Hóa đơn
    (Là bảng liên kết giữa Invoice và chi phí phát sinh)
    """
    ITEM_CHOICES = [
        ('D', 'Drug'),
        ('S', 'Service'),
    ]
    # 1. Liên kết với hóa đơn cha
    invoice = models.ForeignKey('Invoice', on_delete=models.CASCADE, related_name='details')
    # 2. Loại chi phí (Drug, Service)
    item_type = models.CharField(max_length=1, choices=ITEM_CHOICES)
    item_id = models.IntegerField() # ID của Drug (nếu item_type=D) hoặc Service (nếu item_type=S)
    # 3. Ghi nhận chi tiết
    description = models.CharField(max_length=255, null=True, blank=True) # Tên dịch vụ/thuốc
    quantity = models.IntegerField()
    unit_price = models.FloatField() # Giá tại thời điểm lập hóa đơn
    sub_total = models.FloatField()
    # Optional: Có thể thêm FK đến PrescriptionDetail nếu bạn muốn truy vết thuốc chi tiết hơn
    class Meta:
        verbose_name = "Chi tiết Hóa đơn"
        verbose_name_plural = "Chi tiết Hóa đơn"
class ActivityLog(models.Model):
    """Nhật ký hoạt động của người dùng"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='activity_logs')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Nhật ký hoạt động"