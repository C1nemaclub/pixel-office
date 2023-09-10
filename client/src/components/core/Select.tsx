import { FC } from 'react';
import { default as Selector } from 'react-select';

interface SelectProps {
  options: { value: string; label: string }[];
  onChange: (value: string, name: string) => void;
  name: string;
}

const Select: FC<SelectProps> = ({ options, name, onChange }) => {
  return (
    <Selector
      options={options}
      defaultValue={{ value: "default", label: name}}
      onChange={(e) => {
        if (!e) return;
        onChange(e?.value, name);
      }}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: '#110c27',
          padding: '.4em',
        }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
          ...theme.colors,
          primary25: '#c77ef7',
          primary: 'indigo',
          neutral80: '#fff',
        },
      })}
    />
  );
};

export default Select;
