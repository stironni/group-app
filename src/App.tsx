import { useEffect, useState } from "react";
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
  Select,
  CustomSelectOptionInterface,
  Avatar,
  Div,
  Spacing,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import mockData from "./groups.json";
import { GroupCard } from "./groups/ui";
import { GetGroupsResponse, IGroup } from "./interfaces";

const App = () => {
  const getGroupsData = (mockData: IGroup[]): GetGroupsResponse => {
    try {
      if (mockData) {
        return {
          result: 1,
          data: mockData,
        };
      }
    } catch (error) {
      return {
        result: 0,
      };
    }
    return {
      result: 0,
    };
  };

  const platform = usePlatform();

  const { data, result } = getGroupsData(mockData);
  const [groups, setGroups] = useState<any>(data);

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
      ...uniqueColors.map((color) => ({
        value: color,
        label: <Avatar size={20} style={{ backgroundColor: `${color}` }} />,
      })),
      { value: "all", label: "Все" },
      { value: "not", label: "Без цвета" },
    ];
  };

  const colorArray: CustomSelectOptionInterface[] = getColor();

  useEffect(() => {
    setGroups(data);
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
              <Group header={<Header mode="secondary">Фильтры</Header>}>
                <Div>
                  <label htmlFor="privat-id">Сообщество</label>
                  <Spacing size={5} />
                  <Select
                    options={isClose}
                    defaultValue={"0"}
                    id="privat-id"
                    onChange={handleSubmitPrivat}
                    style={{
                      width: "420px",
                    }}
                  />
                  <Spacing size={15} />
                  <label htmlFor="color-id">Цвет</label>
                  <Spacing size={5} />
                  <Select
                    options={colorArray}
                    defaultValue={"all"}
                    id="color-id"
                    onChange={handleSubmitColor}
                    style={{
                      width: "420px",
                    }}
                  />
                  <Spacing size={15} />
                  <label htmlFor="friends-id">Друзья</label>
                  <Spacing size={5} />
                  <Select
                    options={isFriends}
                    defaultValue={"0"}
                    id="friends-id"
                    onChange={handleSubmitFriend}
                    style={{
                      width: "420px",
                    }}
                  />
                </Div>
              </Group>
              <Group header={<Header mode="secondary">Сообщества</Header>}>
                {groups
                  .filter((group: IGroup) => {
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
                    if (colorValue === "not" && !group.avatar_color)
                      return group;
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
