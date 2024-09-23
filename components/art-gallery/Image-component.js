import React from 'react';
import Image from 'next/image';  // 假設您使用的是Next.js的Image組件
import styled from 'styled-components';

const StyledImage = styled(Image)`
  height: 65%;
  object-fit: cover;
  object-position: center;
  transition: all 0.5s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px #BBAF74;
  }
`;

const ImageComponent = ({ src, alt, ...props }) => {
  return (
    <StyledImage
      src={src}
      alt={alt}
      style={{
        objectFit: 'cover',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
      fill
      {...props}
    />
  );
};

export default ImageComponent;
