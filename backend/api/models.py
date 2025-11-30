from django.db import models
from django.utils import timezone
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    class Meta:
        verbose_name_plural = "Vai trò"
    def __str__(self): return self.name
class User(models.Model):
    citizen_id = models.CharField(max_length=20, unique=True, verbose_name="Căn cước/Mã định danh") 
    password_hash = models.CharField(max_length=255)
    email = models.EmailField(max_length=100, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian tạo")    
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='users')
    class Meta:
        verbose_name_plural = "Người dùng"
    def __str__(self): return self.citizen_id
class EmployeeType(models.Model):
    name = models.CharField(max_length=100, unique=True)
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
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        verbose_name_plural = "Khoa/Phòng"
    def __str__(self): return self.name
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='patient_profile')
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    address = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        verbose_name_plural = "Bệnh nhân"
    def __str__(self): return self.full_name
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='employee_profile')
    employee_type = models.ForeignKey(EmployeeType, on_delete=models.PROTECT)
    full_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='employees')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    address = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        verbose_name_plural = "Nhân viên Bệnh viện"
    def __str__(self): return f"{self.employee_type.name}: {self.full_name}"
class Appointment(models.Model):
    STATUS_CHOICES = [('P', 'Pending'), ('C', 'Confirmed'), ('IP', 'In Progress'), ('CM', 'Completed'), ('CA', 'Cancelled')]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='doctor_appointments')
    appointment_datetime = models.DateTimeField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='P')
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian tạo")
    description = models.TextField(null=True, blank=True)
    class Meta:
        unique_together = ('doctor', 'appointment_datetime')
        verbose_name_plural = "Lịch hẹn"
class MedicalRecord(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, primary_key=True, related_name='medical_record')
    date_created = models.DateTimeField(default=timezone.now)
    class Meta:
        verbose_name_plural = "Hồ sơ Bệnh án Tổng hợp"
class HealthConditionType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    class Meta:
        verbose_name = "Thể loại Bệnh/Vấn đề"
    def __str__(self): return self.name
class BasicHealthcare(models.Model):
    medical_record = models.ForeignKey('MedicalRecord', on_delete=models.CASCADE, related_name='health_conditions')
    condition_type = models.ForeignKey(HealthConditionType, on_delete=models.PROTECT, verbose_name="Thể loại")
    disease_name = models.CharField(max_length=255, verbose_name="Tên Bệnh/Vấn đề")
    detected_hospital = models.ForeignKey(Hospital, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Phát hiện tại BV")
    detected_year = models.IntegerField(null=True, blank=True, verbose_name="Năm phát hiện")
    current_status = models.CharField(max_length=100, default='Đang theo dõi', verbose_name="Tình trạng")
    notes = models.TextField(null=True, blank=True, verbose_name="Ghi chú")
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
    class Meta:
        verbose_name_plural = "Thông tin Sức khỏe Cơ bản (Bệnh sử)"
        unique_together = ('medical_record', 'disease_name', 'condition_type')
class MedicalVisit(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, primary_key=True, related_name='visit_detail')
    record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='visits')
    diagnosis = models.TextField(null=True, blank=True)
    treatment_protocol = models.TextField(null=True, blank=True, verbose_name="Phác đồ Điều trị")
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
    class Meta:
        verbose_name_plural = "Chi tiết Lần khám"
class Drug(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Tên Thuốc")
    unit = models.CharField(max_length=50, verbose_name="Đơn vị tính")
    price = models.FloatField(verbose_name="Giá bán lẻ")
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
class PrescriptionDetail(models.Model):
    prescription = models.ForeignKey('Prescription', on_delete=models.CASCADE, related_name='details')
    drug = models.ForeignKey('Drug', on_delete=models.PROTECT, verbose_name="Tên Thuốc") 
    quantity = models.IntegerField()
    dosage = models.CharField(max_length=255, verbose_name="Liều dùng")
    duration_days = models.IntegerField(null=True, blank=True, verbose_name="Thời gian sử dụng (ngày)") 
    recorded_at = models.DateTimeField(default=timezone.now, verbose_name="Thời gian ghi nhận")
    class Meta:
        verbose_name_plural = "Chi tiết Đơn thuốc"
class Prescription(models.Model):
    visit = models.OneToOneField(MedicalVisit, on_delete=models.CASCADE, primary_key=True, related_name='prescription')
    prescription_date = models.DateTimeField(default=timezone.now)
    class Meta:
        verbose_name_plural = "Đơn thuốc"
class ResultType(models.Model):
    name = models.CharField(max_length=100, unique=True) 
    class Meta:
        verbose_name_plural = "Loại Kết quả"
    def __str__(self): return self.name
class Result(models.Model):
    visit = models.ForeignKey(MedicalVisit, on_delete=models.CASCADE, related_name='results')
    result_type = models.ForeignKey(ResultType, on_delete=models.PROTECT)
    technician = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='performed_results') # Nhân viên thực hiện
    result_file_url = models.CharField(max_length=255) # Đường dẫn file kết quả
    start_time = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian bắt đầu")
    end_time = models.DateTimeField(default=timezone.now, verbose_name="Thời gian kết thúc/Có kết quả")
    class Meta:
        verbose_name_plural = "Kết quả Xét nghiệm/Chẩn đoán"
class Service(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.FloatField()
    class Meta:
        verbose_name_plural = "Dịch vụ"
    def __str__(self): return self.name
class Invoice(models.Model):
    STATUS_CHOICES = [('P', 'Pending'), ('PA', 'Paid'), ('CA', 'Cancelled')]
    visit = models.OneToOneField(MedicalVisit, on_delete=models.CASCADE, primary_key=True, related_name='invoice')
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name='invoices')
    total_amount = models.FloatField(default=0.0)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='P')
    class Meta:
        verbose_name_plural = "Hóa đơn"
class InvoiceDetail(models.Model):
    ITEM_CHOICES = [
        ('D', 'Drug'),
        ('S', 'Service'),
    ]
    invoice = models.ForeignKey('Invoice', on_delete=models.CASCADE, related_name='details')
    item_type = models.CharField(max_length=1, choices=ITEM_CHOICES)
    item_id = models.IntegerField()
    description = models.CharField(max_length=255, null=True, blank=True) # Tên dịch vụ/thuốc
    quantity = models.IntegerField()
    unit_price = models.FloatField() # Giá tại thời điểm lập hóa đơn
    sub_total = models.FloatField()
    class Meta:
        verbose_name = "Chi tiết Hóa đơn"
        verbose_name_plural = "Chi tiết Hóa đơn"
class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='activity_logs')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Nhật ký hoạt động"