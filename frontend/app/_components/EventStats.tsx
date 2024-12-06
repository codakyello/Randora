import Stat from "./Stat";
import { Event, Participant, Prize } from "../_utils/types";

export default function EventStats({
  event,
  totalParticipants,
  prizes,
  participants,
}: {
  event: Event;
  totalParticipants: number;
  prizes: Prize[];
  participants: Participant[];
}) {
  const winners = participants?.filter((participant) => participant.prize);
  const stats = [
    {
      title: "Participants",
      backgroundColor: "stat",
      statColor: "black",
      titleColor: "black",
      description: "Unique participants filtered by email.",
      value: totalParticipants || 0,
    },
    {
      title: "Winners",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: `Winners for ${event.name}`,
      value: winners?.length || 0,
    },
    {
      title: "Prizes",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: `Prizes for ${event.name}`,
      value: prizes?.length || 0,
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Stat
          key={stat.title}
          name={stat.title}
          stat={stat.value}
          statColor={stat.statColor}
          backgroundColor={stat.backgroundColor}
          titleColor={stat.titleColor}
          description={stat.description}
        />
      ))}
    </>
  );
}
