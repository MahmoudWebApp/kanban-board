import { useKanban } from "../hooks/useKanban";
import Column from "./Column";

const Board: React.FC = () => {
  const { data, addCard, editCard, deleteCard } = useKanban();

  return (
    <div
      className="flex lg:flex-nowrap flex-wrap gap-4 pb-4 min-w-full"
      style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
    >
      {data.columnOrder.map((id) => (
        <div key={id} className="max-w-max flex-shrink-0">
          <Column
            column={data.columns[id]}
            cards={data.cards}
            onAddCard={addCard}
            onEditCard={editCard}
            onDeleteCard={deleteCard}
          />
        </div>
      ))}
    </div>
  );
};

export default Board;