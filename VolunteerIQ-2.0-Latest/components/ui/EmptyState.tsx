'use client';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon ? (
        <div className="mb-3 opacity-25">{icon}</div>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-6 h-6 text-text3 opacity-25 mb-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      )}
      {title && (
        <h4 className="text-[11px] font-semibold text-text2 mb-1">{title}</h4>
      )}
      <p className="text-[9px] text-text3 max-w-[200px] leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 px-3 py-1.5 rounded-md text-[10px] font-semibold text-v-blue bg-v-blue/10 border border-v-blue/20 hover:bg-v-blue hover:text-white transition-colors duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
