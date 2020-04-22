import React from "react";
import "antd/dist/antd.css";
import Input from "antd/lib/input";
import Form, { FormInstance } from "antd/lib/form";
import debounce from "lodash/debounce";

const hint = "Start typing to search...";
const EXISTING_CODES: string[] = ["A1", "A2"];

type SearchState = {
  loading: boolean;
  code: string;
};

export default class Search extends React.Component<{}, SearchState> {
  state = {
    loading: false,
    code: ""
  };

  formRef = React.createRef<FormInstance>();

  handleChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState(
      { loading: true },
      (): void => {
        this.handleRequestDebounced(value);
      }
    );
  };

  handleRequest = (value: string): void => {
    this.setState(
      { code: value },
      async (): Promise<void> => {
        await this.formRef.current!.validateFields();
      }
    );
    this.setState({ loading: false });
  };

  handleRequestDebounced = debounce(
    (value: string): void => this.handleRequest(value),
    1000
  );

  validateCode = (): Promise<void> => {
    const { code } = this.state;

    return !EXISTING_CODES.includes(code)
      ? Promise.resolve()
      : Promise.reject("Should be unique!");
  };

  render() {
    const { loading } = this.state;

    return (
      <Form ref={this.formRef}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "This field is required!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Enter code for searching"
          name="search"
          rules={[{ validator: this.validateCode }]}
        >
          <Input.Search
            placeholder={hint}
            loading={loading}
            onChange={this.handleChange}
          />
        </Form.Item>
      </Form>
    );
  }
}
