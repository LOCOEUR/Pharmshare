import './Skeleton.css';

const Skeleton = ({ type = 'text', width, height, className = '' }) => {
    const style = {
        width: width || '100%',
        height: height || (type === 'text' ? '1rem' : 'auto')
    };

    return (
        <div
            className={`skeleton-base skeleton-${type} ${className}`}
            style={style}
        ></div>
    );
};

export default Skeleton;
