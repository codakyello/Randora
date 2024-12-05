import Stat from "./Stat";
import { Event } from "../_utils/types";

export default function EventStats({ event }: { event: Event }) {
  const stats = [
    {
      title: "Participants",
      backgroundColor: "stat",
      statColor: "black",
      titleColor: "black",
      description: "Unique participants filtered by email.",
      value: event.participantCount,
    },
    {
      title: "Winners",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: `Winners for ${event.name}`,
      value: event.prizeCount,
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
