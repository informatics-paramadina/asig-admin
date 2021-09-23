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

const Dashboard = () => {
  const [talkshow, setTalkshow] = useState({});
  const [game, setGame] = useState({});
  const [minigame, setMinigame] = useState({});

  useEffect(() => {
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
        setGame(res.data);
      });
      axios
      .get("https://api.himti.my.id/data/player/mini", {
        headers: {
          Authorization: "asigasigasig",
        },
      })
      .then((res) => {
          console.log(res.data)
        setMinigame(res.data);
      });
    return;
  }, []);

  return (
    <EuiPageTemplate
      style={{ width: "100%", marginTop: 60 }}
      pageHeader={{
        pageTitle: "Dashboard",
      }}
    >
      <Header />
      <EuiFlexGrid columns={2}>
        <EuiFlexItem style={{height: 250}}>
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
        <EuiFlexItem style={{height: 250}}>
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
          <EuiFormRow label="List nomor yang ingin dipilih">
            <EuiSelect
              hasNoInitialSelection
              options={[
                { value: "talkshow", text: "Talkshow" },
                { value: "minigame", text: "Minigame" },
                { value: "valorant", text: "Valorant" },
              ]}
            />
          </EuiFormRow>
          <EuiFormRow label="Pesan">
            <EuiTextArea fullWidth />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiPageTemplate>
  );
};

export default Dashboard;
