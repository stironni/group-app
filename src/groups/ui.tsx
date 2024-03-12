import React, { useState } from "react";
import st from "./styles.module.css";

import {
  Group,
  SimpleCell,
  Title,
  Avatar,
  Card,
  Div,
  Text,
  MiniInfoCell,
  Button,
  ModalCardBase,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import { Icon20FollowersOutline } from "@vkontakte/icons";

import { IGroup } from "../interfaces";

type Props = {
  group: IGroup;
};

export const GroupCard = ({ group }: Props) => {
  const [show, setShow] = useState(false);

  const onClose = () => {
    setShow(false);
  };

  const GetFullName = (firstName: string, LastName: string) => {
    return `${firstName} ${LastName}`;
  };

  const GetFirstLatter = (firstName: string, LastName: string) => {
    return `${firstName[0]}${LastName[0]}`;
  };

  return (
    <>
      <Card mode="shadow" className={st.card}>
        <Avatar
          initials={!group.avatar_color ? group.name[0] : undefined}
          size={100}
          style={{ backgroundColor: `${group.avatar_color}` }}
        />
        <Div>
          <Title>{group.name}</Title>
          <Text weight="3">
            {group.closed ? "Закрытое" : "Открытое"} сообщество
          </Text>
          {group.friends ? (
            <>
              <MiniInfoCell
                className={st.subscribers}
                before={<Icon20FollowersOutline />}
              >
                {group.members_count} подписаны ·
                <Button onClick={() => setShow(!show)} mode="tertiary">
                  {Object.keys(group.friends).length} друга
                </Button>
              </MiniInfoCell>
            </>
          ) : (
            <MiniInfoCell
              className={st.subscribers}
              before={<Icon20FollowersOutline />}
            >
              {group.members_count} подписаны
            </MiniInfoCell>
          )}
        </Div>
        {show && (
          <ModalCardBase
            className={st.modalCard}
            dismissButtonMode="inside"
            dismissLabel="Закрыть"
            style={{
              minWidth: 200,
              marginBottom: 20,
            }}
            onClose={onClose}
            actions={
              <React.Fragment>
                {/* <Spacing size={16} /> */}
                <Group>
                  {group.friends?.map((friend) => (
                    <SimpleCell>
                      <>
                        <Div className={st.friends}>
                          <Avatar
                            initials={GetFirstLatter(
                              friend.first_name,
                              friend.last_name
                            )}
                          />
                          {GetFullName(friend.first_name, friend.last_name)}
                        </Div>
                      </>
                    </SimpleCell>
                  ))}
                </Group>
              </React.Fragment>
            }
          />
        )}
      </Card>
    </>
  );
};
