import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleRecipeSelection, resetToChartView } from './recipe-service';
import { state } from './state';
import { updateListSelectionAndScroll, renderComments } from './ui';
import { renderLibraryDetails } from '../components/recipe-list/recipe-list-ui';
import { updateChartSelection } from './features';
import { onCommentsSnapshot } from './firestore';

// Mocking dependencies
vi.mock('./state', () => ({
  state: {
    ui: {
      selectedRecipeId: null,
      isMobileDetailActive: false,
    },
  },
}));

vi.mock('./ui', () => ({
  updateListSelectionAndScroll: vi.fn(),
  renderComments: vi.fn(),
}));

vi.mock('../components/recipe-list/recipe-list-ui', () => ({
  renderLibraryDetails: vi.fn(),
}));

vi.mock('./features', () => ({
  updateChartSelection: vi.fn(),
}));

vi.mock('./firestore', () => ({
  onCommentsSnapshot: vi.fn(() => () => {}), // Mock returns an unsubscribe function
}));

describe('recipe-service', () => {
  beforeEach(() => {
    // Reset state before each test
    state.ui.selectedRecipeId = null;
    state.ui.isMobileDetailActive = false;
    vi.clearAllMocks();
  });

  describe('handleRecipeSelection', () => {
    it('should select a recipe if none is selected', () => {
      handleRecipeSelection('recipe-1');
      expect(state.ui.selectedRecipeId).toBe('recipe-1');
      expect(state.ui.isMobileDetailActive).toBe(true);
      expect(updateListSelectionAndScroll).toHaveBeenCalledWith('recipe-1');
      expect(renderLibraryDetails).toHaveBeenCalled();
      expect(updateChartSelection).toHaveBeenCalled();
      expect(onCommentsSnapshot).toHaveBeenCalled();
    });

    it('should deselect a recipe if it is already selected', () => {
      state.ui.selectedRecipeId = 'recipe-1';
      handleRecipeSelection('recipe-1');
      expect(state.ui.selectedRecipeId).toBe(null);
      expect(state.ui.isMobileDetailActive).toBe(false);
    });

    it('should switch to a new recipe if another is already selected', () => {
      state.ui.selectedRecipeId = 'recipe-1';
      handleRecipeSelection('recipe-2');
      expect(state.ui.selectedRecipeId).toBe('recipe-2');
    });
  });

  describe('resetToChartView', () => {
    it('should reset the selected recipe and UI', () => {
      state.ui.selectedRecipeId = 'recipe-1';
      state.ui.isMobileDetailActive = true;
      resetToChartView();
      expect(state.ui.selectedRecipeId).toBe(null);
      expect(state.ui.isMobileDetailActive).toBe(false);
      expect(updateListSelectionAndScroll).toHaveBeenCalledWith(null);
      expect(renderLibraryDetails).toHaveBeenCalled();
      expect(updateChartSelection).toHaveBeenCalled();
    });
  });
});
