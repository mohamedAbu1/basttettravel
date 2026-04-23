import styled from "styled-components";
import DatePicker from "react-datepicker";

// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export const StyledDatePicker = styled(DatePicker)`
  /* نفس تأثير الكلاسات اللي كتبتها */
  .MuiOutlinedInput-root {
    border-radius: 12px !important;
    padding: 3px !important;
    color: var(--color) !important;
    z-index: 888 !important;
    min-height: 64px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .MuiOutlinedInput-root:focus {
    border: 1px solid var(--color) !important;
  }

  .MuiOutlinedInput-notchedOutline {
    border: 1px solid var(--color) !important;
  }

  .MuiFormControl-root.MuiPickersTextField-root {
    border-radius: 12px !important;
  }

  .MuiPickersInputBase-sectionsContainer {
    padding: 16.5px 5px !important;
  }

  .MuiInputLabel-root {
    z-index: 9999 !important;
    color: #c9a34a;
    font-size: 16px;
    font-weight: 600;
  }

  .MuiInputLabel-root.Mui-focused {
    color: #b9972f !important;
  }

  .MuiInputBase-input {
    color: #fff;
    caret-color: #c9a34a;
    font-size: 18px;
    font-weight: 500;
    padding: 16px 20px;
  }

  .MuiPaper-root {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid #c9a34a;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    padding: 8px;
    animation: fadeIn 0.4s ease-out;
  }

  .MuiPickersDay-root {
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.25s ease;
    outline: none;
  }

  .MuiPickersDay-root:hover {
    background: linear-gradient(to right, #fff8e1, #ffe082);
    color: #b9972f;
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .MuiPickersDay-root.Mui-selected {
    background: linear-gradient(to right, #c9a34a, #b9972f);
    color: #fff;
    font-weight: 600;
    box-shadow: 0 0 0 2px rgba(201, 163, 74, 0.3);
  }

  .MuiPickersDay-root.Mui-selected:hover {
    background: linear-gradient(to right, #b9972f, #a67c00);
    color: #fff;
  }

  .MuiPickersDay-root.Mui-disabled {
    color: #999;
    opacity: 0.6;
  }
`;
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
