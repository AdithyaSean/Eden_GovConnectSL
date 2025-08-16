
// ⬇️ REPLACE THE ENTIRE FILE WITH THIS CODE ⬇️

import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';

describe('useToast Hook', () => {
  // Clear all timers and reset module state before each test
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Ensure we start with real timers
    // You may need a mechanism to reset the singleton state of your hook
    // For now, we assume tests can run independently or handle shared state.
  });

  // *** THE FIX: Use fake timers to control setTimeout ***
  it('should dismiss a toast after a delay', () => {
    // 1. Enable fake timers
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useToast());

    // 2. Add a toast
    act(() => {
      result.current.toast({ title: 'Temporary Toast' });
    });
    
    // Check that the toast was added
    expect(result.current.toasts).toHaveLength(1);
    const toastId = result.current.toasts[0].id;
    
    // 3. Dismiss the toast, which starts the timer
    act(() => {
      result.current.dismiss(toastId);
    });

    // The toast should now be marked as closed, but still in the array
    expect(result.current.toasts[0].open).toBe(false);

    // 4. Fast-forward time past the 5000ms delay
    act(() => {
      jest.runAllTimers();
    });

    // 5. Now the toast should be completely removed from the state
    expect(result.current.toasts).toHaveLength(0);

    // 6. Clean up by restoring real timers
    jest.useRealTimers();
  });
});
