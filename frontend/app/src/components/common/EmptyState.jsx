import React from "react";
import Button from "./Button";

const EmptyState = ({
  title = "Nothing here",
  description = "No data available",
  actionLabel,
  onAction,
  loading = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{description}</p>

      {actionLabel && (
        <Button onClick={onAction} disabled={loading}>
          {loading ? "Loading..." : actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
