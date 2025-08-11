interface StatusIndicatorProps {
  status: boolean
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`}
      title={status ? 'Disponível' : 'Indisponível'}
    ></div>
  )
}
