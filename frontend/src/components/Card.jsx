import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className}`}>
            <div className="px-4 py-5 sm:p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
