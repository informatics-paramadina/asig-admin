import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiImage,
  EuiPageTemplate,
  EuiSpacer,
  EuiText,
} from "@elastic/eui";
import React, { useEffect, useState } from "react";
import Recaptcha from "react-recaptcha";
import AsigLogo from "../Images/blueasig.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";
import axios from "axios";
import { useCookies } from "react-cookie";

const open = moment("2021-10-11 11:35:00");
const close = moment("2021-10-11 12:30:00");
const now = moment();

const Certificate = () => {
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [cookie, setCookie] = useCookies(["asig"]);
  const [data, setData] = useState({
    id_pendaftaran: "",
  });
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setTimeout(() => {
      setCaptchaVisible(true);
    }, 1000);
  });

  function changeValue(e) {
    setData((data) => ({ ...data, id_pendaftaran: e.target.value }));
  }

  function onSubmit() {
    setLoading(true);
    console.log(data);
    axios
      .get(
        `https://api.himti.my.id/data/details/talkshow/${data.id_pendaftaran}`,
        {
          headers: {
            Authorization: "asigasigasig",
          },
        }
      )
      .then((res) => {
        if (!res.data) {
          setLoading(false);
          return MySwal.fire({
            icon: "error",
            title: "ID Pendaftaran Salah!",
            text: "ID pendaftaran tidak ditemukan, silakan perhatikan lagi angka pendaftarannya.",
          });
        }
        console.log(res.data);
        downloadPdf(res.data);
      })
      .catch((err) => {
        setLoading(false);
        return MySwal.fire({
          icon: "error",
          title: "ID Pendaftaran Salah!",
          text: "ID pendaftaran tidak ditemukan, silakan perhatikan lagi angka pendaftarannya.",
        });
      });
  }

  function downloadPdf(userDetail) {
    axios
      .post("https://api.himti.my.id/pdf", data, {
        headers: {
          Authorization: "asigasigasig",
        },
        responseType: "blob",
      })
      .then(async (res) => {
        // console.log(await res.data.text());
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `E-Certificate ${userDetail.name} - Talkshow ASIG-14.pdf`
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        return MySwal.fire({
          icon: "error",
          title: "ID Pendaftaran Salah!",
          text: "ID pendaftaran tidak ditemukan, silakan perhatikan lagi angka pendaftarannya.",
        });
      });
  }

  const testCallback = () => {
    console.log("captcha loaded");
  };

  const verifyCallback = function (response) {
    setCaptcha(true);
    console.log("captcha sukses");
  };

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
    <EuiPageTemplate template="centeredContent">
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={false}>
          <EuiImage src={AsigLogo} size={200} />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiText>
        <h3>Cetak Sertifikat</h3>
      </EuiText>
      <EuiSpacer />
      <EuiFormRow label="Kode Pendaftaran" fullWidth>
        <EuiFieldText
          value={data.id_pendaftaran}
          onChange={changeValue}
          disabled={Object.keys(cookie).length != 0 ? false : true }
          fullWidth
        />
      </EuiFormRow>
      <EuiSpacer />
      {(now.isSameOrAfter(open) && now.isSameOrBefore(close)) ||
      Object.keys(cookie).length != 0 ? (
        captchaVisible ? (
          <Recaptcha
            sitekey={process.env.REACT_APP_CAPTCHA_KEY}
            render="explicit"
            size="normal"
            onloadCallback={testCallback}
            verifyCallback={verifyCallback}
            expiredCallback={expiredCallback}
            theme="dark"
          />
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <EuiSpacer />
      <EuiButton isDisabled={!captcha} isLoading={loading} onClick={onSubmit}>
        Unduh sertifikat
      </EuiButton>
    </EuiPageTemplate>
  );
};

export default Certificate;
