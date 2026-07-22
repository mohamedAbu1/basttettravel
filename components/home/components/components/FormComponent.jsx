"use client";
import React from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import { MdPerson, MdEmail, MdLock } from "react-icons/md";
import { FaMale, FaFemale } from "react-icons/fa";

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
  isDark,
  borderColor,
  textFieldStyle,
  theme,
}) {
  return (
    <>
     <TextField
  label={t("FullName")}
  fullWidth
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <MdPerson className={theme.icon} />
      </InputAdornment>
    ),
  }}
  className={theme.input}
/>

<TextField
  label={t("Email")}
  type="email"
  fullWidth
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <MdEmail className={theme.icon} />
      </InputAdornment>
    ),
  }}
  className={theme.input}
/>

<TextField
  label={t("Password")}
  type="password"
  fullWidth
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <MdLock className={theme.icon} />
      </InputAdornment>
    ),
  }}
  className={theme.input}
/>

<FormLabel component="legend" className={`${theme.text} font-semibold`}>
  {t("Gender")}
</FormLabel>

      <RadioGroup
        row
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={{ justifyContent: "center", gap: "20px" }}
      >
        {/* القيمة الداخلية ثابتة بالإنجليزية */}
        <FormControlLabel
          value="male"
          control={<Radio />}
          label={<><FaMale color="#1e40af" /> {t("male")}</>}
        />
        <FormControlLabel
          value="female"
          control={<Radio />}
          label={<><FaFemale color="#db2777" /> {t("female")}</>}
        />
      </RadioGroup>

      <Divider style={{ margin: "16px 0", color: "#b9972f" }}>
        {t("orsignupwith")}
      </Divider>
    </>
  );
}
