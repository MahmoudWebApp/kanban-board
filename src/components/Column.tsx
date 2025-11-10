import Card from "./Card";
import type { Card as CardType, Column as ColumnType } from "../types";

const Column: React.FC<{
  column: ColumnType;
  cards: Record<string, CardType>;
}> = ({ column, cards }) => {
  return (
    <div className="w-86 bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
      <h2 className="font-medium dark:text-white text-gray-600  mb-2">
        {column.title} ({column.cardIds.length})
      </h2>
      {column.cardIds.map((id) => (
        <Card key={id} title={cards[id].title} content={cards[id].content} />
      ))}
    </div>
  );
};
export default Column;
