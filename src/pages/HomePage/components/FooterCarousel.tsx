import styled from "styled-components";
import BannerImage1 from "../../../assets/bannerImage/banner1.png";
import BannerImage2 from "../../../assets/bannerImage/banner2.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors } from "../../../colors";

const FooterCarousel = () => {
  const slides = [
    { id: 1, image: BannerImage1 },
    { id: 2, image: BannerImage2 },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ticking = useRef(false);

  const scrollToSlide = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.offsetWidth || 1;
    el.scrollTo({ left: index * width, behavior: "smooth" });
  }, []);

  const snapToNearest = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.offsetWidth || 1;
    const index = Math.floor((el.scrollLeft + w * 0.5) / w);
    scrollToSlide(index);
  }, [scrollToSlide]);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (isDragging.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const w = el.offsetWidth || 1;
      const current = Math.round(el.scrollLeft / w);
      const next = (current + 1) % slides.length;
      scrollToSlide(next);
    }, 10000);
  }, [slides.length, scrollToSlide]);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const w = el.offsetWidth || 1;
      const index = Math.floor((el.scrollLeft + w * 0.5) / w);
      setCurrentIndex((prev) => (prev !== index ? index : prev));
      ticking.current = false;
    });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    stopAuto();
    startX.current = e.pageX;
    scrollStart.current = el.scrollLeft;
    el.style.scrollBehavior = "auto";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    const el = scrollRef.current;
    if (!isDragging.current || !el) return;
    e.preventDefault();
    el.scrollLeft = scrollStart.current - (e.pageX - startX.current);
  };

  const onMouseUp = () => {
    const el = scrollRef.current;
    if (!isDragging.current || !el) return;
    isDragging.current = false;
    el.style.scrollBehavior = "smooth";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mouseleave", onMouseUp);
    snapToNearest();
    startAuto();
  };

  const onTouchStart = () => {
    isDragging.current = true;
    stopAuto();
  };
  const onTouchEnd = () => {
    isDragging.current = false;
    snapToNearest();
    startAuto();
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto]);

  return (
    <Wrapper>
      <ScrollContainer
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide) => (
          <Slide key={slide.id}>
            <Image src={slide.image} alt={`banner-${slide.id}`} />
          </Slide>
        ))}
      </ScrollContainer>

      <IndicatorContainer>
        <IndicatorText>
          {currentIndex + 1} / {slides.length}
        </IndicatorText>
      </IndicatorContainer>
    </Wrapper>
  );
};

export default FooterCarousel;

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  margin-top: 160px;
`;

const ScrollContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  touch-action: pan-x;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  flex: 0 0 100%;
  min-width: 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const IndicatorContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 50px;
  z-index: 10;
  border-radius: 30px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const IndicatorText = styled.span`
  color: ${colors.app_white};
  font-size: 30px;
`;
