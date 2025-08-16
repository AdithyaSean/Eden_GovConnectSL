
import { renderHook, act } from '@testing-library/react';
import { useToast, reducer } from '@/hooks/use-toast';

// Mock setTimeout to control timing in tests
// jest.useFakeTimers();

describe('useToast Hook and Reducer', () => {

  describe('Toast Reducer', () => {
    it('should add a toast', () => {
      const initialState = { toasts: [] };
      const newToast = { id: '1', title: 'Test', open: true, onOpenChange: () => {} };
      const action = { type: 'ADD_TOAST', toast: newToast };
      const state = reducer(initialState, action);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].title).toBe('Test');
    });

    it('should update a toast', () => {
      const initialState = { toasts: [{ id: '1', title: 'Old Title', open: true, onOpenChange: () => {} }] };
      const updatedToast = { id: '1', title: 'New Title' };
      const action = { type: 'UPDATE_TOAST', toast: updatedToast };
      const state = reducer(initialState, action);
      expect(state.toasts[0].title).toBe('New Title');
    });

    it('should dismiss a toast', () => {
      const initialState = { toasts: [{ id: '1', title: 'A Toast', open: true, onOpenChange: () => {} }] };
      const action = { type: 'DISMISS_TOAST', toastId: '1' };
      const state = reducer(initialState, action);
      expect(state.toasts[0].open).toBe(false);
    });
    
    it('should remove a toast', () => {
      const initialState = { toasts: [{ id: '1', title: 'A Toast', open: false, onOpenChange: () => {} }] };
      const action = { type: 'REMOVE_TOAST', toastId: '1' };
      const state = reducer(initialState, action);
      expect(state.toasts).toHaveLength(0);
    });

    it('should limit the number of toasts', () => {
        const initialState = { toasts: [{ id: '1', title: 'First', open: true, onOpenChange: () => {} }] };
        const secondToast = { id: '2', title: 'Second', open: true, onOpenChange: () => {} };
        const action = { type: 'ADD_TOAST', toast: secondToast };
        // The TOAST_LIMIT is 1, so adding another should replace the first one
        const state = reducer(initialState, action);
        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0].title).toBe('Second');
    });
  });

  describe('useToast Hook', () => {
    it('should return toasts and a toast function', () => {
      const { result } = renderHook(() => useToast());
      expect(result.current.toasts).toEqual([]);
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should add a toast when calling the toast function', () => {
      const { result } = renderHook(() => useToast());
      act(() => {
        result.current.toast({ title: 'Success' });
      });
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Success');
    });

    it('should dismiss a toast after a delay', () => {
      // 1. Tell Jest to use fake timers
      jest.useFakeTimers();

      const { result } = renderHook(() => useToast());

      // 2. Dispatch the toast inside `act`
      act(() => {
        result.current.toast({ title: 'Temporary Toast' });
      });

      // Assert it's there initially
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Temporary Toast');

      // 3. Advance the timers INSIDE an `act` block to trigger the state update
      act(() => {
        jest.advanceTimersByTime(5000); // Must match TOAST_REMOVE_DELAY
      });

      // 4. Now the toast should be removed from the state
      expect(result.current.toasts).toHaveLength(0);

      // 5. Clean up timers
      jest.useRealTimers();
    });
  });
});
