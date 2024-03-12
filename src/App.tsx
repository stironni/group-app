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
        value: color,
        label: color,
      })),
      { value: "all", label: "Все" },
    ];
  };

  const colorArray: CustomSelectOptionInterface[] = getColor();

  useEffect(() => {
    setGroups(mockData);
    getColor();
  }, []);

  const [privatValue, setPrivatValue] = useState("0");
  const [friendValue, setFriendValue] = useState("0");
  const [colorValue, setColorValue] = useState("all");

  const handleSubmitPrivat = (event: any) => {
    setPrivatValue(event.target.value);
  };

  const handleSubmitFriend = (event: any) => {
    setFriendValue(event.target.value);
  };

  const handleSubmitColor = (event: any) => {
    setColorValue(event.target.value);
  };

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
                  onChange={handleSubmitPrivat}
                />
                <label htmlFor="color-id">Цвет</label>
                <Select
                  options={colorArray}
                  defaultValue={"all"}
                  id="color-id"
                  onChange={handleSubmitColor}
                />

                <label htmlFor="friends-id">Друзья</label>
                <Select
                  options={isFriends}
                  defaultValue={"0"}
                  id="friends-id"
                  onChange={handleSubmitFriend}
                />
                {groups
                  .filter((group: IGroup) => {
                    console.log(privatValue);
                    if (privatValue === "0") return group;
                    if (privatValue === "1" && !group.closed) return group;
                    if (privatValue === "2" && group.closed) return group;
                  })
                  .filter((group: IGroup) => {
                    if (friendValue === "0") return group;
                    if (friendValue === "1" && group.friends) return group;
                    if (friendValue === "2" && !group.friends) return group;
                  })
                  .filter((group: IGroup) => {
                    if (colorValue === "all") return group;
                    if (colorValue === group.avatar_color) return group;
                  })
                  .map((group: IGroup) => (
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
