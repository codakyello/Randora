import Stat from "./Stat";
import { Event } from "../_utils/types";

export default function Stats({ confirmEvents }: { confirmEvents: Event[] }) {
  const totalParticipants = confirmEvents.reduce(
    (acc, event) => acc + event.participantCount,
    0
  );

  const totalPrizes = confirmEvents.reduce(
    (acc, event) => acc + event.prizeCount,
    0
  );

  const remainingPrizes = confirmEvents.reduce(
    (acc, event) => acc + event.remainingPrize,
    0
  );

  const distributedPrize = totalPrizes - remainingPrizes;

  const totalEvents = confirmEvents.length || 0;

  const stats = [
    {
      title: "Participants",
      backgroundColor: "stat",
      statColor: "black",
      titleColor: "black",
      description: "Unique participants filtered by email.",
      value: totalParticipants,
    },
    {
      title: "Events",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: "Completed events count.",
      value: totalEvents,
    },
    {
      title: "Prizes",
      value: totalPrizes,
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: "Total prizes available.",
    },
    {
      title: "Prizes Won",
      value: distributedPrize,
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: "Total prizes drawn in event.",
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
