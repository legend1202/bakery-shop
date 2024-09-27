import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Card, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { upload } from 'src/api/upload';
import { createProduct, updateProduct } from 'src/api/product';

import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

import { IProduct, IUploadUrlType } from 'src/types/product';

type Props = {
  currentProduct: IProduct | any;
  handleUpdateData: (updatedProduct: IProduct) => void;
  onClose: VoidFunction;
};

export default function OwnerForm({ currentProduct, handleUpdateData, onClose }: Props) {
  const [bannerUrls, setBannerUrls] = useState([] as IUploadUrlType);

  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    /* branchId: Yup.string(), */
    name: Yup.string().required(),
    code: Yup.string().required(),
    size: Yup.string(),
    price: Yup.number().required(),
    imageUrls: Yup.array().required(),
    bio: Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      /* branchId: currentProduct?.branchId || '', */
      imageUrls: currentProduct?.imageUrls || [],
      price: currentProduct?.price || '',
      name: currentProduct?.name || '',
      code: currentProduct?.code || '',
      size: currentProduct?.size || '',
      bio: currentProduct?.bio || '',
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useMemo(() => {
    if (currentProduct?.imageUrls) {
      setBannerUrls(currentProduct?.imageUrls);
    }
  }, [currentProduct?.imageUrls]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentProduct?.id) {
        const saveData = {
          ...data,
          imageUrls: bannerUrls,
        } as IProduct;

        const saveResult = await createProduct(saveData);
        if (saveResult?.data?.success) {
          enqueueSnackbar('Create success!');
          handleUpdateData(saveResult.data.result);
        }
      } else {
        const updateData = {
          ...data,
          imageUrls: bannerUrls,
          id: currentProduct?.id,
        } as IProduct;
        const updateResult = await updateProduct(updateData);

        if (updateResult?.data?.success) {
          enqueueSnackbar('Create success!');
          handleUpdateData(updateResult.data.result);
        }
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleUploadImage = async () => {
    console.log('');
  };

  const handleDropBanner = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const uploadResult = await upload(acceptedFiles);

      const newUploadUrls = [uploadResult];
      setBannerUrls([...newUploadUrls]);

      setValue('imageUrls', [...newFiles], { shouldValidate: true });
    },
    [setValue]
  );

  const handleRemoveFileBanner = useCallback(
    (inputFile: File | string) => {
      const filtered = values.imageUrls && values.imageUrls?.filter((file) => file !== inputFile);

      values.imageUrls?.forEach((file, index) => {
        if (file === inputFile) {
          const urlFiltered = bannerUrls?.filter((_, pos) => index !== pos);
          setBannerUrls(urlFiltered);
        }
      });
      setValue('imageUrls', filtered);
    },
    [setValue, values.imageUrls, bannerUrls]
  );

  const handleRemoveAllFilesBanner = useCallback(() => {
    setValue('imageUrls', []);
    setBannerUrls([]);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              {/* {isAdmin && (
                <RHFSelect native name="branchId" label="Branch" InputLabelProps={{ shrink: true }}>
                  <option key="" value="" />
                  {branches?.map((branch: IBranch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </RHFSelect>
              )} */}

              <RHFTextField name="name" label="Name" />

              <RHFTextField name="price" label="Price" type="number" />

              <RHFTextField name="code" label="Code" />

              <RHFTextField name="size" label="Size" />

              <RHFTextField name="bio" label="Bio" />
            </Box>
          </Stack>
        </Card>

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Product Icon</Typography>
                <RHFUpload
                  multiple
                  thumbnail
                  name="imageUrls"
                  maxSize={13145728}
                  onDrop={handleDropBanner}
                  onRemove={handleRemoveFileBanner}
                  onRemoveAll={handleRemoveAllFilesBanner}
                  onUpload={handleUploadImage}
                />
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
