import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBot from "../Component/ChatBot";
import styled from "styled-components";
import { FiLogOut, FiMessageSquare, FiX } from "react-icons/fi";
import { MdOutlineAccountCircle, MdPregnantWoman } from "react-icons/md";

// Styled Components
const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #4a90e2 0%, #3a7bd5 100%);
  color: #fff;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: 600;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-height: 70px;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    flex-direction: column;
    text-align: center;
    min-height: auto;
  }
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin: 0 1rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    order: 1;
  }
`;

const UserInfoContainer = styled.div`
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 300px;

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin: 0.5rem 0;
    order: 2;
    max-width: 100%;
    justify-content: center;
  }
`;

const UserInfo = styled.div`
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    background: none;
    padding: 0;
  }
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  color: #ff85a2;
  font-size: 1.3rem;
`;

const ButtonGroup = styled.div`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin: 0.5rem 0;
    order: 3;
    justify-content: center;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? 'white' : 'transparent'};
  color: ${props => props.variant === 'primary' ? '#4a90e2' : 'white'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.5)'};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 90px;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background: ${props => props.variant === 'primary' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)'};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
    min-width: auto;
  }
`;

// Main Component
const Header = ({ setToken }) => {
  const navigate = useNavigate();
  const [motherId, setMotherId] = useState("");
  const [name, setName] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return {};
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedMotherId = localStorage.getItem("mother_id");

    if (storedMotherId) setMotherId(storedMotherId);

    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded && decoded.name) {
        setName(decoded.name);
      }
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("mother_id");
    navigate("/");
  };

  const toggleChat = () => setChatOpen((prev) => !prev);

  return (
    <>
      <HeaderContainer>
        <UserInfoContainer onClick={() => navigate('/') } style={{ cursor: 'pointer' }}>
          <UserInfo>
            <UserIcon>
              {name ? <MdPregnantWoman /> : <MdOutlineAccountCircle />}
            </UserIcon>
            {name ? `${name} - ${motherId}` : "Not logged in"}
          </UserInfo>
        </UserInfoContainer>

        <Title>Mother Pregnancy Tracker Portal</Title>

        <ButtonGroup>
          <Button 
            onClick={toggleChat} 
            variant={chatOpen ? "secondary" : "primary"}
            aria-label={chatOpen ? "Close chat" : "Open chat"}
          >
            {chatOpen ? <FiX size={18} /> : <FiMessageSquare size={18} />}
            {chatOpen ? "Close" : "Chat"}
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="primary"
            aria-label="Logout"
          >
            <FiLogOut size={18} />
            Logout
          </Button>
        </ButtonGroup>
      </HeaderContainer>

      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
    </>
  );
};

export default Header;