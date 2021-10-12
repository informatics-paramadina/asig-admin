import { EuiButton, EuiFieldText, EuiFormRow, EuiSpacer, EuiTextArea } from "@elastic/eui";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Recaptcha from "react-recaptcha";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EmailBlast = () => {
  const [captcha, setCaptcha] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [blastmsg, setBlastmsg] = useState("");
  const [subject, setSubject] = useState("");
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setTimeout(() => {
      setCaptchaVisible(true);
    }, 1000);
    return;
  });

  const testCallback = () => {
    console.log("captcha loaded");
  };

  const verifyCallback = function (response) {
    setCaptcha(true);
    console.log("captcha sukses");
  };

  const onSubmit = () => {
    if(!captcha) return;
    if(!subject || !blastmsg){
      return MySwal.fire({
        icon: "error",
        title: "Subject dan message harus diisi!",
      });
    }

    axios.post("https://api.himti.my.id/blast/email/talkshow", {
      subject: subject,
      message: blastmsg
    }, {
      headers: {
        "Authorization": "asigasigasig"
      }
    }).then((res)=>{
      return MySwal.fire({
        icon: "success",
        title: "Blast berhasil dikirim!",
      });
    }).catch((err)=>{
      console.log(err)
      return MySwal.fire({
        icon: "error",
        title: "Error!",
        text: "error",
      });
    })
  }

  const expiredCallback = () => {
    setCaptcha(false);
    console.log("captcha expired");
    return MySwal.fire({
      icon: "error",
      title: "Captcha Expired!",
      text: "Waktu validasi captcha sudah kedaluwarsa, silakan lengkapi captcha kembali.",
    });
  };

  return (
    <div>
      <EuiFormRow label="Subject">
        <EuiFieldText onChange={(e) => setSubject(e.target.value)} fullWidth />
      </EuiFormRow>
      <EuiSpacer size="s" />
      <EuiFormRow label="Pesan">
        <EuiTextArea onChange={(e) => setBlastmsg(e.target.value)} fullWidth />
      </EuiFormRow>
      <EuiSpacer size="s" />
      {captchaVisible ? (
        <Recaptcha
          sitekey={process.env.REACT_APP_CAPTCHA_KEY}
          render="explicit"
          onloadCallback={testCallback}
          verifyCallback={verifyCallback}
          expiredCallback={expiredCallback}
          theme="dark"
        />
      ) : (
        ""
      )}
      <EuiSpacer size="s" />
      <EuiButton onClick={onSubmit}>Kirim</EuiButton>
    </div>
  );
};

export default EmailBlast;
