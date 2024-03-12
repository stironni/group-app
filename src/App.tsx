import React, {
  SelectHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  usePlatform,
  Title,
  Select,
  CustomSelectOptionInterface,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import mockData from "./groups.json";
import GroupCard from "./groups/ui";
import { IGroup } from "./interfaces";

const App = () => {
  const platform = usePlatform();

  const [groups, setGroups] = React.useState<any>([]);

  console.log(groups);

  const isClose: CustomSelectOptionInterface[] = [
    {
      value: "0",
      label: "Все",
    },
    {
      value: "1",
      label: "Открытое",
    },
    {
      value: "2",
      label: "Закрытое",
    },
  ];

  const isFriends: CustomSelectOptionInterface[] = [
    {
      value: "0",
      label: "Все",
    },
    {
      value: "1",
      label: "Есть",
    },
    {
      value: "2",
      label: "Нет",
    },
  ];

  const getColor = (): CustomSelectOptionInterface[] => {
    const uniqueColors: string[] = Array.from(
      new Set(
        groups
          .filter((group: IGroup) => group.avatar_color !== undefined)
          .map((group: IGroup) => group.avatar_color)
      )
    );

    return [
      ...uniqueColors.map((color, key) => ({
        value: key + 1,
        label: color,
      })),
      { value: 0, label: "Все" },
    ].sort((a, b) => a.value - b.value);
  };

  const colorArray: CustomSelectOptionInterface[] = getColor();

  console.log("isColor", colorArray);

  useEffect(() => {
    setGroups(mockData);
    getColor();
  }, []);

  useLayoutEffect(() => {
    const selectElement = document.getElementById("privat-id");
    // const selectedValue = selectElement?.selectElement;

    console.log("privateValue", selectElement);
  }, []);

  return (
    <AppRoot>
      <SplitLayout
        header={platform !== "vkcom" && <PanelHeader delimiter="none" />}
      >
        <SplitCol autoSpaced>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>VKUI</PanelHeader>
              <Group header={<Header mode="secondary">Groups</Header>}>
                <Title>Фильтры</Title>
                <label htmlFor="privat-id">Сообщество</label>
                <Select
                  options={isClose}
                  defaultValue={"0"}
                  id="privat-id"
                  onSelect={(event) => console.log()}
                />
                <label htmlFor="color-id">Цвет</label>
                <Select options={colorArray} defaultValue={"0"} id="color-id" />

                <label htmlFor="friends-id">Друзья</label>
                <Select
                  options={isFriends}
                  defaultValue={"0"}
                  id="friends-id"
                />
                {groups.map((group: IGroup) => (
                  <GroupCard group={group} key={group.id} />
                ))}
              </Group>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};

export default App;
