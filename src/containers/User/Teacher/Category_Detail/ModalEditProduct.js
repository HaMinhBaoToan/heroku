import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button,Radio } from "antd";
import { Player } from "video-react";
import { changeTailURL } from "../../../../utils/utils";

const ModalEditProduct = ({
  visibleModalEditProduct,
  ProductEdit,
  onEditProduct,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm();

  const [previewVideo, setpreviewVideo] = useState();
  const [showVideo, setshowVideo] = useState(true);
  const [messError, setmessError] = useState("");
  // const openfile = async (e) => {
  //   var reader = new FileReader();
  //   return await new Promise((solve) => {
  //     reader.onloadend = function (event) {
  //       const dataURL = reader.result;
  //       solve(dataURL);
  //     };
  //     reader.readAsArrayBuffer(e.target.files[0]);
  //   });
  // };

  const uploadFile = async (e) => {
    if (e.target.files[0]) {
      const sizeFile = e.target.files[0].size;
      const typeFile = e.target.files[0].type.split("/")[1];
      if (sizeFile > 100000000) {
        setmessError("Dung lượng tệp quá lớn, vui lòng chọn file < 100MB");
        setshowVideo(false);
      }
      if (typeFile !== "mp4") {
        setmessError(
          "Định đạnh file không đúng, vui lòng chọn file có định dạng MP4"
        );
        setshowVideo(false);
      } else {
        console.log("file ok");
        setshowVideo(true);

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = function (event) {
          const dataURL = event.target.result;
          setpreviewVideo(dataURL); // preview
        };

        form.setFieldsValue({
          File: e.target.files[0],
          ChangeFile: true,
        });
      }
    }
   
  };
  // console.log(ProductEdit.Public.data[0])
  useEffect(() => {
    if (ProductEdit) {
      setpreviewVideo(ProductEdit.Video); // preview
      setshowVideo(true);
      form.setFieldsValue({
        ProductName: ProductEdit.ProductName,
        ProductId: ProductEdit.ProductId,
        NumberNo: ProductEdit.NumberNo,
        ChangeFile: false,
        Public:ProductEdit.Public.data[0]
      });
    }
  }, [ProductEdit,form]);
  return (
    <Modal
      width={1000}
      visible={visibleModalEditProduct}
      title="Sửa Thông Tin Khóa Học"
      okText="Sửa"
      cancelText="Đóng"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                onEditProduct(values);
            // form.resetFields();

              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          {loading ? "Vui lòng đợi trong giây lát" : "Chỉnh sửa"}
        </Button>,
      ]}
      // onOk={() => {
      //   form
      //     .validateFields()
      //     .then((values) => {
      //       onEditProduct(values);
      //     })
      //     .catch((info) => {
      //       console.log("Validate Failed:", info);
      //     });
      // }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="ProductId" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
        <Form.Item
          name="NumberNo"
          label="Bài số: "
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "-webkit-fill-available" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="ProductName"
          label="Tên Video : "
          rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Public"
          label="Trạng Thái Hiển Thì Cho Xem Trước:"
          rules={[{ required: true, message: "Please pick an item!" }]}
        >
          <Radio.Group size="middle">
            <Radio.Button style={{ color: "#52c41a" }} value={1}>
              Hiển thị 
            </Radio.Button>
            <Radio.Button style={{ color: "#faad14" }} value={0}>
              Tạm Ẩn
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <input
          id="videoss"
          className="inputFile"
          type="file"
          accept="video/*"
          onChange={(e) => uploadFile(e)}
        />

        {showVideo ? (
          <Player
            poster={previewVideo && changeTailURL(previewVideo)}
            src={previewVideo}
          />
        ) : (
          <h5 className="text-danger">{messError}</h5>
        )}

        <Form.Item name="File" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
        <Form.Item name="ChangeFile" style={{ display: "none" }}>
          <Input type={"hidden"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditProduct;
