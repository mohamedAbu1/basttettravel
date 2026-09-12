"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { MdPerson, MdEmail, MdLock } from "react-icons/md";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaMale, FaFemale } from "react-icons/fa";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function FormComponent({
  t,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  gender,
  setGender,
  showPassword,
  setShowPassword,
  theme,
}) {
  return (
    <>
      <TextField
        label={t("FullName")}
        fullWidth
        required
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdPerson className={theme.icon} />
            </InputAdornment>
          ),
        }}
        className="auth-field"
      />

      <TextField
        label={t("Email")}
        type="email"
        fullWidth
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdEmail className={theme.icon} />
            </InputAdornment>
          ),
        }}
        className="auth-field"
      />

      <TextField
        label={t("Password")}
        type={showPassword ? "text" : "password"}
        fullWidth
        required
        inputProps={{ minLength: 8, maxLength: 128 }}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-field"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdLock className={theme.icon} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </InputAdornment>
          ),
        }}
      />
      <DividerWithIcon />

      <div className="auth-gender-row flex flex-row items-center justify-around">
        <FormLabel component="legend" className={`${theme.text} font-semibold`}>
        {t("Gender")}
      </FormLabel>

      <RadioGroup
        row
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="auth-gender-options"
      >
        {/* القيمة الداخلية ثابتة بالإنجليزية */}
        <FormControlLabel
          value="male"
         
          control={<Radio />}
          label={
            <div className="auth-gender-option">
              <FaMale color="#1e40af" /> <span className="capitalize">{t("male")}</span>
            </div>
          }
        />
          <FormControlLabel
          value="female"
          control={<Radio />}
          label={
            <div className="auth-gender-option">
              <FaFemale color="#db2777" /> <span className="capitalize">{t("female")}</span>
            </div>
          }
        />
      </RadioGroup>
      </div>
    </>
  );
}
