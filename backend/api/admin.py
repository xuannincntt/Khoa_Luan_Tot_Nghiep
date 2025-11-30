from django import forms
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import *

# --- 1. Form tùy chỉnh để mã hóa mật khẩu User ---
class UserAdminForm(forms.ModelForm):
    password = forms.CharField(
        label="Mật khẩu (Nhập để thay đổi)",
        widget=forms.PasswordInput,
        required=False,
        help_text="Nhập mật khẩu mới nếu muốn thay đổi. Để trống nếu giữ nguyên."
    )

    class Meta:
        model = User
        fields = '__all__'

    def save(self, commit=True):
        user = super().save(commit=False)
        raw_password = self.cleaned_data.get('password')
        if raw_password:
            user.password_hash = make_password(raw_password)
        if commit:
            user.save()
        return user

# --- 2. Cấu hình giao diện Admin cho User ---
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ('citizen_id', 'email', 'phone', 'role', 'is_active', 'created_at')
    search_fields = ('citizen_id', 'email', 'phone')
    list_filter = ('role', 'is_active')
    exclude = ('password_hash',) # Ẩn trường hash thô

# --- 3. Đăng ký các Model (CHỈ ĐĂNG KÝ 1 LẦN) ---

# Đăng ký User với class UserAdmin vừa tạo
admin.site.register(User, UserAdmin)

# Các model khác đăng ký cơ bản
admin.site.register(Role)
admin.site.register(Employee)
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(Department)
admin.site.register(Drug)
admin.site.register(Service)
admin.site.register(Invoice)
admin.site.register(EmployeeType) # Đừng quên model này nếu có