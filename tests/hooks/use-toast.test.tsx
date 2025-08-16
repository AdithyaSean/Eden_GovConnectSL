
import { renderHook, act } from '@testing-library/react';
import { useToast, reducer } from '@/hooks/use-toast';

// Mock setTimeout to control timing in tests
jest.useFakeTimers();

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
      // Fast-forward timers to check if it gets removed after delay
      act(() => {
        jest.runAllTimers();
      });
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
        jest.useFakeTimers();
        const { result } = renderHook(() => useToast());
        
        act(() => {
            result.current.toast({ title: 'Temporary Toast' });
        });
        
        // At this point, the toast is visible
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].open).toBe(true);

        // Fast-forward time by the remove delay
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        
        // Now the toast should be removed from the state
        expect(result.current.toasts).toHaveLength(0);
        jest.useRealTimers();
    });
  });
});
