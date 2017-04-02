import ColorInterface from './colorInterface';

interface SpriteInterface {
    getImage(callback: (err, image) => void);
}

export default SpriteInterface;