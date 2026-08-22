import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Slide
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { white } from "../../../style/color-main/color";
import { useDispatch, useSelector } from "react-redux";
import {setformInfo ,resetForm, Add_Criteria ,} from '../../../backend/slice/Criteria/add'
// دالة الحركة الانزلاقية من الأعلى للأسفل
function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

const AddCriteriaModal = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // جلب البيانات وحالة التحميل والخطأ من ستور الإضافة
  const { formInfo, isLoading, error } = useSelector((state) => state.Add_Criteria);

  // حالة التحكم بالـ Toast العلوي
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' أو 'error'
  });

  // تنظيف الحقول وإعادتها فارغة فور إغلاق المودال أو فتحه مجدداً
  useEffect(() => {
    if (!open) {
      dispatch(resetForm());
    }
  }, [open, dispatch]);

  // مراقبة حالة الخطأ القادمة من السيرفر بشكل مباشر
  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        message: typeof error === 'string' ? error : "حدث خطأ ما أثناء إضافة المعيار!",
        severity: "error",
      });
    }
  }, [error]);

  // تحديث بيانات الستور عند الكتابة داخل الحقول
  const handleChange = (key, value) => {
    dispatch(setformInfo({ [key]: value }));
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
    if (toast.severity === 'error') {
      dispatch(resetForm()); // تصفير الخطأ عند إغلاق التنبيه يدوياً
    }
  };

  const handleSubmit = () => {
    if (!formInfo.name.trim() || !formInfo.points.trim()) {
      setToast({
        open: true,
        message: "الرجاء ملء جميع الحقول المطلوبة أولاً",
        severity: "error",
      });
      return;
    }

    dispatch(Add_Criteria())
      .unwrap()
      .then(() => {
        // عرض رسالة النجاح فوراً
        setToast({
          open: true,
          message: "تم إضافة المعيار بنجاح!",
          severity: "success",
        });

        // تأخير الإغلاق قليلاً ليعطي تأثيراً بصرياً مريحاً للمستخدم
        setTimeout(() => {
          if (typeof onSuccess === "function") onSuccess(); 
          if (typeof onClose === "function") onClose();       
        }, 1500);
      })
      .catch((err) => {
        console.error("فشلت عملية الإضافة:", err);
      });
  };

  return (
    <>
      {/* التنبيه العلوي اللطيف (Toast) */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={TransitionDown}
        sx={{ direction: "rtl" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            fontFamily: "inherit",
            '& .MuiAlert-icon': {
              marginLeft: '12px',
              marginRight: 0
            }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.primary.imagecard1,
            color: theme.palette.primary.text3,
            borderRadius: "12px",
            p: 1,
            direction: "rtl" // التأكد من توجيه المودال بالكامل للغة العربية
          },
        }}
      >
        <DialogTitle
          sx={{
            color: theme.palette.primary.text3,
            textAlign: "right",
            fontWeight: 700,
            position: "relative",
            pt: 2
          }}
        >
          إضافة المعيار

          <IconButton
            onClick={onClose}
            disabled={isLoading}
            sx={{
              position: "absolute",
              left: 8,
              top: 12,
              color: theme.palette.primary.text3,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* حقل اسم المعيار */}
          <TextField
            fullWidth
            placeholder="ادخل اسم المعيار"
            value={formInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
            margin="normal"
            disabled={isLoading}
            InputProps={{
              sx: {
                color: theme.palette.primary.text7,
                backgroundColor: theme.palette.primary.inputt,
                borderRadius: "8px",
              },
            }}
            inputProps={{
              style: {
                textAlign: "right",
              },
            }}
          />

          {/* حقل عدد النقاط */}
          <TextField
            fullWidth
            placeholder="عدد النقاط"
            value={formInfo.points}
            onChange={(e) => handleChange("points", e.target.value)}
            margin="normal"
            inputMode="numeric"
            disabled={isLoading}
            InputProps={{
              sx: {
                color: theme.palette.primary.text7,
                backgroundColor: theme.palette.primary.inputt,
                borderRadius: "8px",
              },
            }}
            inputProps={{
              style: {
                textAlign: "right",
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || !formInfo.name.trim() || !formInfo.points.trim()}
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: theme.palette.primary.button1,
              color: white,
              fontWeight: 600,
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: theme.palette.primary.button1,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "إضافة"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCriteriaModal;