import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "@/compnents/shared/layout";
import BestFive from "@/compnents/BestFive/BestFive";
import Employees from "@/compnents/Employees/Employees";

export default function dashboard() {
  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <BestFive/>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Employees/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
