import Stat from "./Stat";
import { Event } from "../_utils/types";

export default function Stats({ confirmEvents }: { confirmEvents: Event[] }) {
  const totalParticipants = confirmEvents?.reduce(
    (acc, event) => acc + event?.participantCount,
    0
  );

  const totalPrizes = confirmEvents?.reduce((acc, event) => {
    console.log(event?.prizeCount);
    return acc + event?.prizeCount;
  }, 0);

  console.log(totalPrizes);
  const remainingPrizes = confirmEvents?.reduce(
    (acc, event) => acc + event?.remainingPrize,
    0
  );

  const distributedPrize = totalPrizes - remainingPrizes;

  const totalEvents = confirmEvents?.length || 0;

  const stats = [
    {
      title: "Participants",
      backgroundColor: "stat",
      statColor: "black",
      titleColor: "black",
      description: "Participants for active/completed events.",
      value: totalParticipants,
    },
    {
      title: "Completed/Active Events",
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: "Completed/active events count.",
      value: totalEvents,
    },
    {
      title: "Total Prizes (Created)",
      value: totalPrizes,
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: "Total prizes created for active/completed events.",
    },
    {
      title: "Distributed Prizes",
      value: distributedPrize,
      backgroundColor: "grey",
      statColor: "primary",
      titleColor: "grey",
      description: "Total prizes drawn in active/completed events.",
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
