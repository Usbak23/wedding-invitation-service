import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BankAccountService } from '../services/bank-account.service';
import { CreateBankAccountDto } from '../validators/bank-account.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { ParseUuidPipe } from '../middlewares/parse-uuid.pipe';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Bank Account')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/invitations/:invitationId/bank-accounts')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get()
  @ApiOperation({ summary: 'Get bank accounts by invitation' })
  async getAll(@Param('invitationId', ParseUuidPipe) invitationId: string, @Req() req: any) {
    const data = await this.bankAccountService.getByInvitation(invitationId, req.user.id);
    return successResponse(data);
  }

  @Post()
  @ApiOperation({ summary: 'Add bank account to invitation' })
  async create(
    @Param('invitationId', ParseUuidPipe) invitationId: string,
    @Body() dto: CreateBankAccountDto,
    @Req() req: any,
  ) {
    const data = await this.bankAccountService.create(invitationId, dto, req.user.id);
    return successResponse(data, 'Bank account added');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bank account' })
  async delete(@Param('id', ParseUuidPipe) id: string, @Req() req: any) {
    await this.bankAccountService.delete(id, req.user.id);
    return successResponse(null, 'Bank account deleted');
  }
}
