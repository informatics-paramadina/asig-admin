import {
  EuiButton,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiLoadingContent,
  EuiPageTemplate,
  EuiSelect,
  EuiSpacer,
  EuiStat,
  EuiText,
  EuiTextArea,
} from "@elastic/eui";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Utils/Header";
import TalkshowTabel from "../Utils/TalkshowTabel";
import GameTable from "../Utils/GameTable";
import Minigame from "../Utils/MinigameTable";
import Recaptcha from "react-recaptcha";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const [talkshow, setTalkshow] = useState({});
  const [mselect, setMselect] = useState("");
  const [availableSelect, setAvailableSelect] = useState([]);
  const [game, setGame] = useState({});
  const [minigame, setMinigame] = useState({});
  const [countData, setCountData] = useState({
    talkshow: 0,
    mini: 0,
    game: 0,
  });
  const [captcha, setCaptcha] = useState(false);
  const [blastmsg, setBlastmsg] = useState("");
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [cookie, setCookie] = useCookies(["asig"]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (cookie.asig == "talkshow" || cookie.asig == "webdev") {
      availableSelect.push({ value: "talkshow", text: "Talkshow" });
    }

    if (cookie.asig == "game" || cookie.asig == "webdev") {
      availableSelect.push({ value: "valorant", text: "Valorant" });
      availableSelect.push({ value: "minigame", text: "Minigame" });
    }

    return;
  }, []);

  useEffect(() => {
    console.log(cookie);
    axios
      .get("https://api.himti.my.id/data/player/talkshow", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        setCountData((countData) => ({
          ...countData,
          talkshow: res.data.length,
        }));
        setTalkshow(res.data);
      });
    axios
      .get("https://api.himti.my.id/data/player/game", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        setCountData((countData) => ({ ...countData, game: res.data.length }));
        setGame(res.data);
      });
    axios
      .get("https://api.himti.my.id/data/player/mini", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        setCountData((countData) => ({ ...countData, mini: res.data.length }));
        setMinigame(res.data);
      });
    setTimeout(() => {
      setCaptchaVisible(true);
    }, 1000);
    return;
  }, []);

  const downloadExcel = () => {
    axios
      .get("https://api.himti.my.id/xlsx", {
        headers: {
          Authorization: "asigasigasig",
        },
        responseType: 'blob'
      })
      .then(async (res) => {
        // console.log(await res.data.text());
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `test.xlsx`
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

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

  const onSend = () => {
    if (!captcha) {
      console.log("captcha gagal!");
      return MySwal.fire({
        icon: "error",
        title: "Captcha Gagal!",
        text: "Silakan lengkapi captcha terlebih dahulu.",
      });
    }
    if (blastmsg.length == 0) {
      console.log("message wajib diisi!");
      return MySwal.fire({
        icon: "error",
        title: "Message Kosong!",
        text: "Message blast wajib diisi.",
      });
    }
    // console.log(response);
    let type = "";
    switch (mselect) {
      case "minigame":
        type = "mini";
        break;
      case "talkshow":
        type = "talkshow";
        break;
      case "valorant":
        type = "game";
        break;
      default:
        console.log("select wajib diisi!");
        return MySwal.fire({
          icon: "error",
          title: "Select kosong!",
          text: "Silakan pilih select terlebih dahulu",
        });
    }
    setWaiting(true);
    axios
      .post(
        `https://api.himti.my.id/blast/wa/${type}`,
        {
          message: blastmsg,
        },
        {
          headers: {
            Authorization: "asigasigasig",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("sukses");
    MySwal.fire({
      icon: "success",
      title: "Pesan berhasil dikirim!",
      text: "Pesan blast akan dikirim sesuai dengan antrian, harap sabar!",
      timer: 3000,
    });
    return setTimeout(() => {
      setWaiting(false);
      window.location.reload();
    }, 3000);
  };

  return (
    <EuiPageTemplate
      style={{ width: "100%", marginTop: 60 }}
      pageHeader={{
        pageTitle: "Dashboard",
      }}
    >
      <Header />
      <EuiButton onClick={downloadExcel} isDisabled={cookie.asig == "panitia" ? true : false }>Download Excel</EuiButton>
      <EuiSpacer size="s"/>
      <EuiFlexGrid columns={2}>
        <EuiFlexItem style={{ height: 350 }}>
          <EuiText>
            <h3>Pendaftar Talkshow</h3>
          </EuiText>
          <EuiStat
            title={countData.talkshow}
            isLoading={Object.keys(talkshow).length == 0}
          />
          <EuiSpacer size={"s"} />
          {Object.keys(talkshow).length != 0 ? (
            <TalkshowTabel data={talkshow} />
          ) : (
            <EuiLoadingContent lines={6} />
          )}
        </EuiFlexItem>
        <EuiFlexItem style={{ height: 350 }}>
          <EuiText>
            <h3>Pendaftar Game</h3>
          </EuiText>
          <EuiStat
            title={countData.game}
            isLoading={Object.keys(game).length == 0}
          />
          <EuiSpacer size={"s"} />
          {Object.keys(game).length != 0 ? (
            <GameTable data={game} />
          ) : (
            <EuiLoadingContent lines={6} />
          )}
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText>
            <h3>Pendaftar MiniGame</h3>
          </EuiText>
          <EuiStat
            title={countData.mini}
            isLoading={Object.keys(minigame).length == 0}
          />
          <EuiSpacer size={"s"} />
          {Object.keys(minigame).length != 0 ? (
            <Minigame data={minigame} />
          ) : (
            <EuiLoadingContent lines={6} />
          )}
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow
            label="List nomor yang ingin dipilih"
            helpText="DILARANG MELAKUKAN SPAMMING"
          >
            <EuiSelect
              hasNoInitialSelection
              onChange={(e) => setMselect(e.target.value)}
              value={mselect}
              options={availableSelect}
            />
          </EuiFormRow>
          <EuiFormRow label="Pesan">
            <EuiTextArea
              onChange={(e) => setBlastmsg(e.target.value)}
              fullWidth
            />
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
          <EuiButton onClick={onSend} isLoading={waiting}>
            Kirim
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiPageTemplate>
  );
};

export default Dashboard;
