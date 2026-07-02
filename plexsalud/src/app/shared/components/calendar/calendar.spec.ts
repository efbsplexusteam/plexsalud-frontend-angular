import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Calendar } from './calendar';
import { State } from '../../../modules/auth/services/state';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;
  let mockState: State;

  beforeEach(async () => {
    mockState = new State();

    await TestBed.configureTestingModule({
      imports: [Calendar],
      providers: [{ provide: State, useValue: mockState }],
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update calendarOptions.events when events input changes', () => {
      const testEvents = signal([{ title: 'Test', start: '2026-07-15' }]);
      component.events = testEvents;

      component.ngOnChanges({
        events: {
          currentValue: testEvents,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect((component.calendarOptions.events as any)).toBe(testEvents);
    });

    it('should NOT update calendarOptions when other inputs change', () => {
      const originalEvents = component.calendarOptions.events;

      component.ngOnChanges({
        otherInput: {
          currentValue: 'value',
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      } as any);

      expect(component.calendarOptions.events).toBe(originalEvents);
    });
  });

  describe('handleDateClick', () => {
    it('should return early for past dates', () => {
      const pastDate = new Date('2020-01-01');
      const mockArg = {
        date: pastDate,
        view: {
          calendar: {
            view: { type: 'dayGridMonth' },
            changeView: vi.fn(),
          },
        },
      } as any;

      component.handleDateClick(mockArg);

      expect(mockArg.view.calendar.changeView).not.toHaveBeenCalled();
    });

    it('should switch from month view to day view for future dates', () => {
      const futureDate = new Date('2099-12-01');
      const mockChangeView = vi.fn();
      const mockArg = {
        date: futureDate,
        view: {
          calendar: {
            view: { type: 'dayGridMonth' },
            changeView: mockChangeView,
          },
        },
      } as any;

      component.handleDateClick(mockArg);

      expect(mockChangeView).toHaveBeenCalledWith('timeGridDay', futureDate);
    });

    it('should prompt for title on day view and emit addAppointment', () => {
      const futureDate = new Date('2099-12-15T10:00:00');
      vi.spyOn(window, 'prompt').mockReturnValue('Test Event');
      const addSpy = vi.spyOn(component.addAppointment, 'emit');

      const mockCalendarApi = {
        view: { type: 'timeGridDay' },
        changeView: vi.fn(),
        addEvent: vi.fn(),
      };
      const mockArg = {
        date: futureDate,
        view: { calendar: mockCalendarApi },
      } as any;

      component.handleDateClick(mockArg);

      expect(addSpy).toHaveBeenCalledWith(mockArg);
      expect(mockCalendarApi.addEvent).toHaveBeenCalledWith({
        title: 'Test Event',
        start: futureDate,
        extendedProps: { secreto: 'dato oculto' },
      });
      expect(mockCalendarApi.changeView).toHaveBeenCalledWith('dayGridMonth');
    });

    it('should NOT emit addAppointment when prompt is cancelled', () => {
      const futureDate = new Date('2099-12-15T10:00:00');
      vi.spyOn(window, 'prompt').mockReturnValue(null);
      const addSpy = vi.spyOn(component.addAppointment, 'emit');

      const mockCalendarApi = {
        view: { type: 'timeGridDay' },
        changeView: vi.fn(),
        addEvent: vi.fn(),
      };
      const mockArg = {
        date: futureDate,
        view: { calendar: mockCalendarApi },
      } as any;

      component.handleDateClick(mockArg);

      expect(addSpy).not.toHaveBeenCalled();
      expect(mockCalendarApi.addEvent).not.toHaveBeenCalled();
    });
  });

  describe('handleEventClick', () => {
    it('should return early in month view', () => {
      const mockArg = {
        view: { calendar: { view: { type: 'dayGridMonth' } } },
      } as any;

      component.handleEventClick(mockArg);

      expect(mockArg.view.calendar).toBeTruthy();
    });

    it('should return early for past events', () => {
      const mockArg = {
        event: { startStr: '2020-06-01', title: 'Old Event', remove: vi.fn() },
        view: { calendar: { view: { type: 'timeGridDay' }, changeView: vi.fn() } },
      } as any;

      component.handleEventClick(mockArg);

      expect(mockArg.event.remove).not.toHaveBeenCalled();
    });

    it('should emit removeAppointment and remove event on confirm', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const removeSpy = vi.spyOn(component.removeAppointment, 'emit');

      const mockArg = {
        event: {
          startStr: '2099-12-15',
          title: 'Test Event',
          remove: vi.fn(),
        },
        view: {
          calendar: {
            view: { type: 'timeGridDay' },
            changeView: vi.fn(),
          },
        },
      } as any;

      component.handleEventClick(mockArg);

      expect(removeSpy).toHaveBeenCalledWith(mockArg);
      expect(mockArg.event.remove).toHaveBeenCalledOnce();
      expect(mockArg.view.calendar.changeView).toHaveBeenCalledWith('dayGridMonth');
    });

    it('should NOT remove event when confirm is cancelled', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      const mockArg = {
        event: {
          startStr: '2099-12-15',
          title: 'Test Event',
          remove: vi.fn(),
        },
        view: {
          calendar: {
            view: { type: 'timeGridDay' },
            changeView: vi.fn(),
          },
        },
      } as any;

      component.handleEventClick(mockArg);

      expect(mockArg.event.remove).not.toHaveBeenCalled();
    });
  });
});
