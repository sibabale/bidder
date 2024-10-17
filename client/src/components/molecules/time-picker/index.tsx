import { ChangeEventHandler } from 'react';
import { setHours, setMinutes } from 'date-fns';
import TextInput from '../../atoms/text-input';

interface TimePickerProps {
    label: string;
    timeValue: string;
    selectedDate?: Date;
    onTimeChange: (date: Date) => void;
    onTimeInputChange: (time: string) => void;
}

function TimePicker({
    label,
    timeValue,
    selectedDate,
    onTimeChange,
    onTimeInputChange,
}: TimePickerProps) {
    const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const time = e.target.value;
        onTimeInputChange(time);

        if (!selectedDate) return;

        const [hours, minutes] = time.split(':').map(Number);
        const newSelectedDate = setHours(setMinutes(selectedDate, minutes), hours);
        onTimeChange(newSelectedDate);
    };

    return (
        <TextInput
            label={label}
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="w-1/2"
        />
    );
}

export default TimePicker;
