import React from "react";
import { Button, Modal, Form, Select, Input } from "antd";
import { Upload, Icon } from 'antd';
import { notification } from 'antd';
import './style.css';

const { Option } = Select;

const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    state = {
      loading: false,
      imageUrl: null,
      photoUrl: null,

    };


    handleReuest = e => {
      this.setState({ imageUrl: e.file });
    };
    componentDidMount() {
      const id = 6;
      // const { id } = this.props.id;
      fetch(`/api/v1/getCaptainDetails/${id}`)
        .then(res => res.json())
        .then(res => {
          if (res.result) {
            const rows = res.result[0];
            const status = rows.b_status ? "true" : "false";
            this.props.form.setFieldsValue({
              name: rows.s_name, email: rows.s_email, phone: rows.s_mobile_number,
              address: rows.s_address, IDNumber: rows.s_id_number, licenceNumber: rows.s_driver_licence_number,
              status, file: rows.s_image,
            });
            var formData = this.props.form.getFieldsValue();
            fetch(`/api/v1/image/${rows.s_image}`)
              .then(res => res.arrayBuffer())
              .then(response => {
                let typeArray = new Uint8Array(response);
                const stringChar = String.fromCharCode.apply(null, typeArray);

                this.setState({
                  photoUrl: stringChar
                });
              })

            // this.setState({ photoUrl: rows.s_image })
          }
          else {
            notification.open({
              message: 'فشل',
              description:
                res.error,
              icon: <Icon type="meh" style={{ color: '#108ee9' }} />,
            });
          }

        })

        .catch(err => {
          notification.open({
            message: 'فشل',
            description: 'هناك خطأ ما الرجاء اعادة ارسال البيانات',
            icon: <Icon type="meh" style={{ color: '#108ee9' }} />,
          })
        }
        );


    }
    render() {
      const uploadButton = (
        <Button className="btn--upload">

          <Icon type={this.state.loading ? 'check-circle' : 'upload'} />
          أرفق صورة
        </Button>

      );
      const imageUrl = this.state.imageUrl;
      const photoUrl = this.state.photoUrl;
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="تعديل كابتن"
          okText="حفظ"
          onCancel={onCancel}
          onOk={onCreate}
          cancelText="إلغاء"
          className="edit-captain__popup"
        >
          <Form className='edit-captain__form'>
            <div className="edit-captain-container-left">
              <Form.Item label="رقم الهوية" >
                {getFieldDecorator("IDNumber", {
                  rules: [
                    { required: true, message: "يرجى ملئ الحقل بارقام ", pattern: /^[0-9]{9}$/ }
                  ]
                })(<Input type="text" id="IDNumber" />)}
              </Form.Item>
              <Form.Item label="رقم الرخصة">
                {getFieldDecorator("licenceNumber", {
                  rules: [
                    { required: true, message: "يرجى ملئ الحقل بارقام ", pattern: /^[0-9]{7}$/ }
                  ]
                })(<Input type="text" id="licenceNumber" />)}
              </Form.Item>
              <Form.Item label="الحالة">
                {getFieldDecorator("status", {
                  rules: [
                    { required: true, message: "يرجى اختيار حالة" }
                  ]
                })(
                  <Select style={{ width: 80 }} id='status'>
                    <Option value="true">فعال </Option>
                    <Option value="false">غير فعال</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="صورة الهوية">
                {getFieldDecorator("file", {
                  rules: [
                    {
                      required: true,
                      message: "يرجى رفع صورة الكابتن"
                    }
                  ]
                })(<Upload
                  accept=".jpg , .png, .jpeg"
                  name="file"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={this.handleReuest}
                  multiple={false}
                >
                  {uploadButton}
                  <div className="image__name">
                    {(imageUrl) ? imageUrl && <><Icon type="check-circle" />{imageUrl.name}</> : photoUrl && <><Icon /><img src={photoUrl} className="upload-photo" /></>}

                  </div>
                </Upload>)}
              </Form.Item>

            </div>
            <div className='edit-captain-container-center'></div>
            <div className='edit-captain-container-right'>
              <Form.Item label="الاسم">
                {getFieldDecorator("name", {
                  rules: [
                    { required: true, message: "يرجى ملئ الحقل بحروف ", pattern: /^([أ-يa-z]|\s)+$/ }
                  ]
                })(<Input type="text" id="name"
                />)}
              </Form.Item>
              <Form.Item label="البريد">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "يرجى ملئ الحقل بريد الكتروني",
                      pattern: /.+\@.+\..+/
                    }
                  ]
                })(<Input type="email" id="email" />)}
              </Form.Item>
              <Form.Item label="كلمة المرورالجديدة">
                {getFieldDecorator("password", {
                  rules: [
                    {
                    }
                  ]
                })(<Input type="password" id="password" />)}
              </Form.Item>
              <Form.Item label="الهاتف">
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "الرجاء ملئ الحقل بارقام",
                      pattern: /^\+?[0-9]{10,12}$/
                    }
                  ]
                })(<Input type="text" id="phone" />)}
              </Form.Item>

              <Form.Item label="العنوان" dir="ltr">
                {getFieldDecorator("address", {
                  rules: [
                    { required: true, message: "يرجى ملئ الحقل بحروف ", pattern: /^[أ-يa-z]*$/ }
                  ]
                })(<Input type="text" id="address" />)}
              </Form.Item>
            </div>
          </Form>
        </Modal>
      );
    }
  }
);

class CollectionsPage extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };


  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      else {
        const { IDNumber, address, email, licenceNumber, name, password, phone, status, file } = values;
        const formData = new FormData();
        if (!file.fileList) {
          formData.append('file', file);
        } else {
          formData.append('file', file.fileList[0].originFileObj);
        }
        formData.append('IDNumber', IDNumber);
        formData.append('address', address);
        formData.append('email', email);
        formData.append('licenceNumber', licenceNumber);
        formData.append('name', name);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('status', status);
        const id = 6;
        // const { id } = this.props.id;
        fetch(`/api/v1/putCaptain/${id}`, {
          method: 'PUT',
          body: formData,
        })
          .then(res => res.json())
          .then(res => {
            if (res.result) {
              notification.open({
                message: 'نجح',
                description:
                  'تم التعديل بنجاح',
                icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
              });
            }
            else {

              notification.open({
                message: 'يتعذر',
                description: res.error,
                icon: <Icon type="meh" style={{ color: '#108ee9' }} />,
              });
            }
          })
          .catch(err => {
            notification.open({
              message: 'يتعذر',
              description: 'هناك خطأ ما الرجاء اعادة ارسال البيانات',
              icon: <Icon type="meh" style={{ color: '#108ee9' }} />,
            })
          }
          )
        form.resetFields();
        this.setState({ visible: false });
      }
    });

  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };


  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          New Collection
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default CollectionsPage;
