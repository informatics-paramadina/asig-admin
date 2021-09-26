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
  const [game, setGame] = useState({});
  const [minigame, setMinigame] = useState({});
  const [captcha, setCaptcha] = useState(false);
  const [blastmsg, setBlastmsg] = useState("");
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [cookie, setCookie] = useCookies(["asig"]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    console.log(cookie);
    axios
      .get("https://api.himti.my.id/data/player/talkshow", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        setTalkshow(res.data);
      });
    axios
      .get("https://api.himti.my.id/data/player/game", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        console.log(res.data);
        setGame(res.data);
      });
    axios
      .get("https://api.himti.my.id/data/player/mini", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
        setMinigame(res.data);
      });
    setTimeout(() => {
      setCaptchaVisible(true);
    }, 1000);
    return;
  }, []);

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
      <EuiFlexGrid columns={2}>
        <EuiFlexItem style={{ height: 250 }}>
          <EuiText>
            <h3>Pendaftar Talkshow</h3>
          </EuiText>
          <EuiSpacer size={"s"} />
          {Object.keys(talkshow).length != 0 ? (
            <TalkshowTabel data={talkshow} />
          ) : (
            <EuiLoadingContent lines={6} />
          )}
        </EuiFlexItem>
        <EuiFlexItem style={{ height: 250 }}>
          <EuiText>
            <h3>Pendaftar Game</h3>
          </EuiText>
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
              options={
                (cookie.asig == "talkshow")
                  ? [
                      { value: "talkshow", text: "Talkshow" },
                    ]
                  : [
                      { value: "minigame", text: "Minigame" },
                      { value: "valorant", text: "Valorant" },
                    ]
              }
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
