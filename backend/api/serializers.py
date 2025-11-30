from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password # Dùng để mã hóa mật khẩu

# --- NHÓM 1: DANH MỤC (Dùng cho Dropdown list) ---
class RoleSerializer(serializers.ModelSerializer):
    class Meta: model = Role; fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta: model = Department; fields = '__all__'

class EmployeeTypeSerializer(serializers.ModelSerializer):
    class Meta: model = EmployeeType; fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta: model = Service; fields = '__all__'

class DrugSerializer(serializers.ModelSerializer):
    class Meta: model = Drug; fields = '__all__'

# --- NHÓM 2: NGƯỜI DÙNG & AUTH ---
# Serializer dùng để hiển thị thông tin User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'citizen_id', 'email', 'phone', 'is_active', 'role']
        extra_kwargs = {'password_hash': {'write_only': True}} # Giấu mật khẩu

# Serializer đặc biệt dùng cho ĐĂNG KÝ BỆNH NHÂN (Lồng ghép User + Patient)
class PatientRegistrationSerializer(serializers.ModelSerializer):
    # Khai báo các trường của User để nhập liệu chung 1 form
    citizen_id = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, write_only=True)
    phone = serializers.CharField(write_only=True)

    class Meta:
        model = Patient
        fields = ['citizen_id', 'password', 'email', 'phone', 
                  'full_name', 'date_of_birth', 'gender', 'address']

    def create(self, validated_data):
        # 1. Tách dữ liệu User ra và XÓA khỏi validated_data (dùng pop)
        c_id = validated_data.pop('citizen_id')
        pwd = validated_data.pop('password')
        
        # SỬA LỖI TẠI ĐÂY: Dùng pop thay vì get để xóa email khỏi list dữ liệu tạo Patient
        # Tham số thứ 2 là '' để nếu không có email thì mặc định là rỗng, tránh lỗi KeyError
        email = validated_data.pop('email', '') 
        
        phone = validated_data.pop('phone')
        
        # 2. Tạo User trước
        # Mặc định Role là PATIENT (ID=3)
        try:
            patient_role = Role.objects.get(name='PATIENT') 
        except Role.DoesNotExist:
            # Fallback nếu chưa chạy fixture, tránh crash hệ thống
            patient_role, _ = Role.objects.get_or_create(name='PATIENT')

        user = User.objects.create(
            citizen_id=c_id,
            password_hash=make_password(pwd), # Mã hóa password
            email=email,
            phone=phone,
            role=patient_role,
            is_active=True # Đảm bảo user tạo xong dùng được ngay
        )
        
        # 3. Tạo Patient liên kết với User đó
        # Lúc này validated_data chỉ còn: full_name, date_of_birth, gender, address
        patient = Patient.objects.create(user=user, **validated_data)
        
        return patient

# Serializer hiển thị thông tin Bệnh nhân (để xem profile)
class PatientSerializer(serializers.ModelSerializer):
    user_info = UserSerializer(source='user', read_only=True)
    class Meta: model = Patient; fields = '__all__'

# Serializer hiển thị thông tin Nhân viên/Bác sĩ
class EmployeeSerializer(serializers.ModelSerializer):
    user_info = UserSerializer(source='user', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    type_name = serializers.CharField(source='employee_type.name', read_only=True)
    class Meta: model = Employee; fields = '__all__'

# --- NHÓM 3: NGHIỆP VỤ (Đặt lịch, Khám) ---
class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'