import { format, isValid, parse } from 'date-fns';
import { useId, useState, useRef, useEffect } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import TextInput from '../../atoms/text-input';

function DatePicker({ label }: { label: string }) {
    const inputId = useId();
    const pickerRef = useRef<HTMLDivElement>(null);

    const [month, setMonth] = useState(new Date());

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [inputValue, setInputValue] = useState('');

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleDayPickerSelect = (date: Date | undefined) => {
        if (!date) {
            setInputValue('');
            setSelectedDate(undefined);
        } else {
            setSelectedDate(date);
            setMonth(date);
            setInputValue(format(date, 'MM/dd/yyyy'));
        }
        setIsDatePickerOpen(false);
    };

    const defaultClassNames = getDefaultClassNames();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        const parsedDate = parse(e.target.value, 'MM/dd/yyyy', new Date());
        if (isValid(parsedDate)) {
            setSelectedDate(parsedDate);
            setMonth(parsedDate);
        } else {
            setSelectedDate(undefined);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={pickerRef}>
            <TextInput
                id={inputId}
                type="text"
                label={label}
                value={inputValue}
                required
                placeholder="MM/dd/yyyy"
                onFocus={() => setIsDatePickerOpen(true)}
                onChange={handleInputChange}
                className="border border-gray-300 w-1/2 md:w-3/5"
            />

            {isDatePickerOpen && (
                <DayPicker
                    month={month}
                    style={{ width: '100%' }}
                    onMonthChange={setMonth}
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDayPickerSelect}
                    footer={`Selected: ${selectedDate?.toDateString()}`}
                    classNames={{
                        root: `${defaultClassNames.root} shadow-lg p-5`,
                        today: `border-primary`,
                        selected: `bg-primary border-primary text-white`,
                        chevron: `${defaultClassNames.chevron} fill-primary`,
                    }}
                />
            )}
        </div>
    );
}

export default DatePicker;
