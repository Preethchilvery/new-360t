import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PanoramaViewer from '../components/PanoramaViewer';

describe('PanoramaViewer', () => {
  it('renders without crashing', () => {
    render(<PanoramaViewer imageUrl="/test-panorama.jpg" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('loads the correct image', () => {
    const testImageUrl = '/test-panorama.jpg';
    render(<PanoramaViewer imageUrl={testImageUrl} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', testImageUrl);
  });
}); 