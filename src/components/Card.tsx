const Card: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  return (
    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100  mb-2">
      <h3 className="font-medium text-sm dark:text-white text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-200 font-normal ">
        {content}
      </p>
    </div>
  );
};
export default Card;
