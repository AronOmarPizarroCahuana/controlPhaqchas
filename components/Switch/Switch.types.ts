export type SwitchProps = {
    id: number;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};