
'use client';

import { Download } from 'lucide-react';

type SpecialEventForICS = {
  id: string | number;
  title: string;
  type?: string;
  description?: string;
  rawDate?: string; 
  location?: string;
};

type RegularProgramForICS = {
  id: string | number;
  title: string;
  type?: string;
  description?: string;
  day: string; // e.g., "Sunday"
  frequency?: string;
  time?: string;
  location?: string;
};

type CalendarExportButtonProps = {
  specialEvents: SpecialEventForICS[];
  regularPrograms: RegularProgramForICS[];
  className?: string;
};

export default function CalendarExportButton({
  specialEvents,
  regularPrograms,
  className = '',
}: CalendarExportButtonProps) {
  const generateAndDownloadICS = () => {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Your Church//Church Events Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    const now = new Date();
    const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // Special one-time events (all-day events for simplicity)
    specialEvents.forEach((event) => {
      if (!event.rawDate) return;

      const startDate = new Date(event.rawDate);
      if (isNaN(startDate.getTime())) return;

      const dtStart = startDate.toISOString().split('T')[0].replace(/-/g, '');

      const uid = `special-${event.id}@yourchurch.com`;
      const summary = event.title.replace(/,/g, '\\,');
      const description = [
        event.description || '',
        event.type ? `Type: ${event.type}` : '',
      ]
        .filter(Boolean)
        .join(' \\n')
        .replace(/,/g, '\\,');

      const location = (event.location || 'Main Sanctuary').replace(/,/g, '\\,');

      icsLines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT'
      );
    });

    // Recurring regular programs (weekly for next 2 years)
    const untilDate = new Date();
    untilDate.setFullYear(untilDate.getFullYear() + 2);
    const until = untilDate.toISOString().split('T')[0].replace(/-/g, '');

    const dayMap: Record<string, string> = {
      Sunday: 'SU',
      Monday: 'MO',
      Tuesday: 'TU',
      Wednesday: 'WE',
      Thursday: 'TH',
      Friday: 'FR',
      Saturday: 'SA',
    };

    regularPrograms.forEach((program) => {
      const dayAbbr = dayMap[program.day];
      if (!dayAbbr) return;

      const uid = `regular-${program.id}@yourchurch.com`;
      const summary = program.title.replace(/,/g, '\\,');
      const description = [
        program.description || '',
        `Type: ${program.type || 'Program'}`,
        `Frequency: ${program.frequency || 'Weekly'}`,
        program.time ? `Time: ${program.time}` : '',
      ]
        .filter(Boolean)
        .join(' \\n')
        .replace(/,/g, '\\,');

      const location = (program.location || 'Main Sanctuary').replace(/,/g, '\\,');

      icsLines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${dayAbbr};UNTIL=${until}`,
        'END:VEVENT'
      );
    });

    icsLines.push('END:VCALENDAR');

    const icsContent = icsLines.join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'church-events-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateAndDownloadICS}
      className={`inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-[#0C1844]/90 font-semibold text-lg shadow-md transition-all ${className}`}
    >
      <Download size={20} />
      Export Calendar
    </button>
  );
}