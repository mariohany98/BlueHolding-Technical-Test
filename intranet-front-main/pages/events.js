import Layout from "@/compnents/shared/layout";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import UpcommingEvents from "../compnents/home/Upcomming-Events/Card";
import BirthdaysCard from "../compnents/home/Birthdays/BirthdaysCard";
import Link from "next/link";

export default function events() {
  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <BirthdaysCard />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <UpcommingEvents />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
