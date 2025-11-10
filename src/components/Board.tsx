import { useKanban } from "../hooks/useKanban";
import Column from "./Column";

const Board: React.FC = () => {
  const { data } = useKanban();
  return (
    <div className="flex gap-4   ">
      {data.columnOrder.map((id) => (
        <Column key={id} column={data.columns[id]} cards={data.cards} />
      ))}
    </div>
  );
};
export default Board;
